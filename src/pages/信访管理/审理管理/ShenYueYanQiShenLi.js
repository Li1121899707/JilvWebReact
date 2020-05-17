import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Timeline } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'

const { Option } = Select

class YanQiShenLi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderOption_shenLiGuanLi_yanQi: [],
      leaderList: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.statusKey = 'shenLiGuanLi_yanQi'
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_shenLiGuanLi_yanQi: res.data.form.shenLiGuanLi_yanQiYiJian,
          leader: '',
          taskDefinitionKey: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        },
        this.huoquhouxunaren
      )
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = async () => {
    const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
    console.log(taskGroup)
    const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey)
    this.setState({
      leaderList,
      taskDefinitionKey
    })
  }

  submit = () => {
    // let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    let leader
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      // let yijianArr = []
      let yanQiArr = []
      let countYanQiArr = []
      // if (this.state.dataSource.shenLiGuanLi_niBanYiJian) {
      //   yijianArr = this.state.dataSource.shenLiGuanLi_niBanYiJian
      // }
      if (this.state.dataSource.shenLiGuanLi_yanQiYiJian) {
        yanQiArr = this.state.dataSource.shenLiGuanLi_yanQiYiJian
      }
      if (this.state.dataSource.shenLiGuanLi_countYanQiYiJian) {
        countYanQiArr = this.state.dataSource.shenLiGuanLi_countYanQiYiJian
      }

      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '审理工作延期意见',
        advise: values.shenLiGuanLi_yanQiShenLi_yiJian ? values.shenLiGuanLi_yanQiShenLi_yiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      // yijianArr.push(obj)
      yanQiArr.push(obj)
      countYanQiArr[countYanQiArr.length - 1].shenLiGuanLi_yanQiYiJian = yanQiArr

      values.shenLiGuanLi_countYanQiYiJian = countYanQiArr
      values.shenLiGuanLi_yanQiYiJian = yanQiArr
      // values.shenLiGuanLi_niBanYiJian = yijianArr
      if (err) return false
      const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'shenLiGuanLi_yanQi_dangWeiShuJi') {
        values.shenLiGuanLi_status = '案件审理延期申请已审批'
      } else {
        values.shenLiGuanLi_status = '案件审理延期申请审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenLiGuanLi_status = '案件审理延期申请已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
        res => {
          notification.success({ message: '提交成功' })
          router.goBack()
        }
      )
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList, taskDefinitionKey } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>案件审理工作延期申请呈批表</p>
          <Form>
            <table className={styles.table} style={{ width: 950 }}>
              <tbody>
                <tr>
                  <td className={styles.label} style={{ width: 200 }}>
                    线索来源
                  </td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期事项</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_yanQiShenLi_yanQiShiXiang} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期理由</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_yanQiShenLi_yanQiLiYou} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期时间</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_yanQiShenLi_shenQingShiJian} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>意见</td>
                  <td className={styles.val} height={100}>
                    <Timeline mode='left'>
                      {this.state.leaderOption_shenLiGuanLi_yanQi.map((item, index) => (
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
            <div className={styles.title} style={{ marginTop: 20 }}>
              <TableInput>
                <Form.Item label='领导审批意见：' style={{ display: 'flex' }}>
                  {getFieldDecorator('shenLiGuanLi_yanQiShenLi_yiJian', {
                    rules: [{ required: true, message: '必填!' }]
                  })(<Input.TextArea rows={8} size='large' style={{ width: 850 }} />)}
                </Form.Item>
              </TableInput>
            </div>
          </Form>

          <div>
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex' }}>
                <Form.Item style={{ display: 'flex' }} label='批办领导'>
                  {getFieldDecorator('shenLiGuanLi_yanQi_jiWeiShuJi', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Select style={{ width: 200 }} onChange={this.selectChange}>
                      {isLeader(taskDefinitionKey, this.statusKey)}
                      {leaderListItem}
                    </Select>
                  )}
                </Form.Item>
              </div>
            )}
          </div>
          <div className={styles.submitDiv}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                返回
              </Button>
              <Button type='primary' className={styles.submitBtn} onClick={this.submit}>
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(YanQiShenLi)
export default wapper
