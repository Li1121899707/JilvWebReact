import React, { Component } from 'react'
import { Button, Form, Input, DatePicker, notification, Select, Tabs, Timeline } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'

const { TabPane } = Tabs

class liAnYanQiShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_shenChaDiaoCha_yanQiYiJian: [],
      task: {},
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'LiAnShenCha_yanQi'
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task
      for (let i = res.data.historicUserTaskInstanceList.length - 1; i > 0; i--) {
        if (res.data.historicUserTaskInstanceList[i].taskDefinitionKey.indexOf('LiAnShenCha_yanQi_') > -1) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_shenChaDiaoCha_yanQiYiJian: res.data.form.shenChaDiaoCha_yanQiYiJian,
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
      if (taskGroup === 'LiAnShenCha_yanQi_dangWeiShuJi') {
        values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表已审批'
      } else {
        values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      if (err) return false
      let yijianArr = []
      let yanQiArr = []
      let countYanQiArr = []
      if (this.state.dataSource.shenChaDiaoCha_yanQiWaiCha) {
        yijianArr = this.state.dataSource.shenChaDiaoCha_yanQiWaiCha
      }
      if (this.state.dataSource.shenChaDiaoCha_yanQiYiJian) {
        yanQiArr = this.state.dataSource.shenChaDiaoCha_yanQiYiJian
      }
      if (this.state.dataSource.shenChaDiaoCha_countYanQiYiJian) {
        countYanQiArr = this.state.dataSource.shenChaDiaoCha_countYanQiYiJian
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)

      const obj = {
        name: window.USER.userName,
        type: '审理工作延期意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      yijianArr.push(obj)
      yanQiArr.push(obj)
      countYanQiArr[countYanQiArr.length - 1].shenChaDiaoCha_yanQiYiJian = yanQiArr
      values.shenChaDiaoCha_countYanQiYiJian = countYanQiArr
      values.shenChaDiaoCha_yanQiWaiCha = yijianArr
      values.shenChaDiaoCha_yanQiYiJian = yanQiArr
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
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>
            内蒙古自治区纪委监委驻自治区农信联社纪检监察组
            <br />
            立案审查工作延期申请呈批表
          </p>
          <Form style={{ textAlign: 'center' }}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期事项</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_gongZuoYanQi_shiXiang} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期理由</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_gongZuoYanQi_liYou} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>原要求完成时间</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian
                          ? moment(dataSource.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期时间</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian
                          ? moment(dataSource.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期单位意见</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>意见</td>
                  <td className={styles.val} colSpan={7}>
                    <Timeline mode='left'>
                      {this.state.leaderOption_shenChaDiaoCha_yanQiYiJian.map((item, index) => (
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
            {this.type === 'add' && (
              <div className={styles.title} style={{ marginTop: 20 }}>
                <TableInput data={dataSource.shenChaDiaoCha_niBanYiJian}>
                  <Form.Item label='领导审阅意见' style={{ display: 'flex' }}>
                    {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                      rules: [{ required: true, message: '必填!' }]
                    })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 900 }} />)}
                  </Form.Item>
                </TableInput>
              </div>
            )}
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
            {this.type === 'add' && (
              <Button type='primary' onClick={this.submit}>
                提交保存
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(liAnYanQiShenPiTable)
export default wapper
