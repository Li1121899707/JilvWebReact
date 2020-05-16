/*
 * @author: 王志鹏
 * @Datetime  2020/2/20 13:49
 */
import React, { Component } from 'react'
import { Button, Form, Input, notification, Select, Timeline, Upload } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import { exportFiles } from '@/utils/common'

const { Option } = Select

class waiChaGongZuoShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_shenChaDiaoCha_waiChaYiJian: [],
      task: {},
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.statusKey = 'LiAnShenCha_waiCha'
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task
      for (let i = res.data.historicUserTaskInstanceList.length - 1; i > 0; i--) {
        if (res.data.historicUserTaskInstanceList[i].taskDefinitionKey.indexOf('LiAnShenCha_waiCha_') > -1) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_shenChaDiaoCha_waiChaYiJian: res.data.form.shenChaDiaoCha_waiChaYiJian,
          task,
          taskDefinitionKey: task.taskDefinitionKey
        },
        this.huoquhouxunaren
      )
    })
  }

  submit = () => {
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    let leader
    const { data, task } = this.state
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      const taskGroup = this.state.task.taskDefinitionKey
      if (taskGroup === 'LiAnShenCha_waiCha_dangWeiShuJi') {
        values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表已审批'
      } else {
        values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      if (err) return false
      let yijianArr = []
      let waiChaArr = []
      let countWaiChaArr = []
      if (this.state.dataSource.shenChaDiaoCha_yanQiWaiCha) {
        yijianArr = this.state.dataSource.shenChaDiaoCha_yanQiWaiCha
      }
      if (this.state.dataSource.shenChaDiaoCha_waiChaYiJian) {
        waiChaArr = this.state.dataSource.shenChaDiaoCha_waiChaYiJian
      }
      if (this.state.dataSource.shenChaDiaoCha_countWaiChaYiJian) {
        countWaiChaArr = this.state.dataSource.shenChaDiaoCha_countWaiChaYiJian
      }
      const obj = {
        name: window.USER.userName,
        type: '审理工作外查意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      yijianArr.push(obj)
      waiChaArr.push(obj)
      countWaiChaArr[countWaiChaArr.length - 1].shenChaDiaoCha_waiChaYiJian = waiChaArr
      values.shenChaDiaoCha_yanQiWaiCha = yijianArr
      values.shenChaDiaoCha_waiChaYiJian = waiChaArr
      values.shenChaDiaoCha_countWaiChaYiJian = countWaiChaArr
      post(
        `thread/claimAndComplete?taskId=${task.taskInstanceId}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = async () => {
    const taskGroup = this.state.task.taskDefinitionKey
    const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey)
    this.setState({
      leaderList,
      taskDefinitionKey
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  group = (array, subGroupLength) => {
    let index = 0
    let newArray = []
    while (index < array.length) {
      newArray.push(array.slice(index, (index += subGroupLength)))
    }
    return newArray
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { leaderList, dataSource, taskDefinitionKey } = this.state
    const data = dataSource
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>外查工作方案呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被反映人姓名</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={styles.label}>单位</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>民族</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>立案依据</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={data.shenChaDiaoCha_liAnYiJu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>审查阶段需查明的问题</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={data.shenChaDiaoCha_shenChaFangAn_wenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>意见</td>
                  <td className={styles.val} colSpan={7}>
                    <Timeline mode='left'>
                      {this.state.leaderOption_shenChaDiaoCha_waiChaYiJian.map((item, index) => (
                        <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                          <div>
                            {item.name} {item.time}
                          </div>
                          <div className={styles.bold}>{item.type}：</div>
                          <div>{item.advise}</div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.shenChaDiaoCha_waiChaGongZuo_files &&
                dataSource.shenChaDiaoCha_waiChaGongZuo_files.map(item => (
                  <a
                    target='_blank'
                    onClick={() => {
                      exportFiles(`${window.server}/api/files/${item.response.path}`, item.response.path)
                    }}
                  >
                    {item.response.fileName}&emsp;
                  </a>
                ))}
            </p>
            <div className={styles.title}>
              <TableInput data={dataSource.shenChaDiaoCha_niBanYiJian}>
                <Form.Item label='领导审阅意见' style={{ display: 'flex' }}>
                  {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                    rules: [{ required: true, message: '必填!' }]
                  })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 900 }} />)}
                </Form.Item>
              </TableInput>
            </div>
          </Form>
          <div>
            {this.state.leaderList.length > 0 && (
              <Form.Item style={{ display: 'flex' }} label='批办领导'>
                {getFieldDecorator('wenTiXianSuo_shenPiLingDao', {
                  rules: [{ required: true, message: '必填!' }]
                })(
                  <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                    {isLeader(taskDefinitionKey, this.statusKey)}
                    {leaderListItem}
                  </Select>
                )}
              </Form.Item>
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button
              style={{ marginRight: 20, marginTop: 20 }}
              onClick={() => {
                router.goBack()
              }}
            >
              返回
            </Button>
            <Button type='primary' onClick={this.submit}>
              提交保存
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(waiChaGongZuoShenPiTable)
export default wapper
