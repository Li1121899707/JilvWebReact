/*
 * @author: bifan
 * @Datetime  2020/2/19 15:15
 */
import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber } from 'antd'
import { router } from 'umi'
import moment from 'moment'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'

const { Option } = Select

class YanQiShenLi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leader: '',
      leaderList: []
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
    this.huoquhouxunaren()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data
        // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  finshTask = () => {
    const { data } = this.state
    let taskid = ''
    for (let i = data.historicUserTaskInstanceList.length; i > 0; i--) {
      if (!data.historicUserTaskInstanceList[i - 1].ended && data.historicUserTaskInstanceList[i - 1].taskName === '发起延期申请或直接填写审理报告') {
        taskid = data.historicUserTaskInstanceList[i - 1].taskInstanceId
      }
    }
    post(`activiti/completeTask?taskId=${taskid}`, { shenLiGuanLi_caoZuo: '延期' }).then(res => {
      this.getTask()
    })
  }

  getTask = () => {
    const { data } = this.state
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data
          // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        },
        () => {
          this.submit()
        }
      )
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    let taskid = ''
    for (let i = data.historicUserTaskInstanceList.length; i > 0; i--) {
      if (!data.historicUserTaskInstanceList[i - 1].ended && data.historicUserTaskInstanceList[i - 1].taskName !== '发起延期申请或直接填写审理报告') {
        taskid = data.historicUserTaskInstanceList[i - 1].taskInstanceId
      }
    }
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      values.shenLiGuanLi_status = '已填写案件审理延期申请'
      values.shenLiGuanLi_yanQiShenLi_shenQingShiJian = values.shenLiGuanLi_yanQiShenLi_shenQingShiJian
        ? values.shenLiGuanLi_yanQiShenLi_shenQingShiJian.format('YYYY-MM-DD')
        : ''
      if (err) return false
      // let yijianArr = []
      let yanQiArr = []
      let countYanQiArr = []
      const YanQiArrObj = {}
      // if (this.state.dataSource.shenLiGuanLi_niBanYiJian) {
      //   yijianArr = this.state.dataSource.shenLiGuanLi_niBanYiJian
      // }
      if (this.state.dataSource.shenLiGuanLi_countYanQiYiJian) {
        countYanQiArr = this.state.dataSource.shenLiGuanLi_countYanQiYiJian
      }
      const obj = {
        name: window.USER.userName,
        type: '延期审批承办部门意见',
        advise: values.shenLiGuanLi_yanQiShenLi_yiJian ? values.shenLiGuanLi_yanQiShenLi_yiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/petition/management/${processInstanceId}/${countYanQiArr.length}/YanQiShenLi`
      }
      // yijianArr.push(obj)
      yanQiArr.push(obj)
      YanQiArrObj.shenLiGuanLi_yanQiYiJian = yanQiArr
      YanQiArrObj.shenLiGuanLi_yanQiShenLi_yanQiShiXiang = values.shenLiGuanLi_yanQiShenLi_yanQiShiXiang
      YanQiArrObj.shenLiGuanLi_yanQiShenLi_yanQiLiYou = values.shenLiGuanLi_yanQiShenLi_yanQiLiYou
      YanQiArrObj.shenLiGuanLi_yanQiShenLi_shenQingShiJian = values.shenLiGuanLi_yanQiShenLi_shenQingShiJian
      countYanQiArr.push(YanQiArrObj)
      // values.shenLiGuanLi_niBanYiJian = yijianArr
      values.shenLiGuanLi_yanQiYiJian = yanQiArr
      values.shenLiGuanLi_countYanQiYiJian = countYanQiArr
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'shenLiGuanLi_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList } = this.state
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
                    <TableInput data={dataSource.shenLiGuanLi_yanQiShenLi_yanQiShiXiang}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_yanQiShenLi_yanQiShiXiang', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' style={{ width: '100%', height: 50 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期理由</td>
                  <td className={styles.val} height={50}>
                    <TableInput data={dataSource.shenLiGuanLi_yanQiShenLi_yanQiLiYou}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_yanQiShenLi_yanQiLiYou', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' style={{ width: '100%', height: 50 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期时间</td>
                  <td className={styles.val} height={50}>
                    <TableInput data={dataSource.shenLiGuanLi_yanQiShenLi_shenQingShiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_yanQiShenLi_shenQingShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker size='large' style={{ width: '100%', height: 50 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>承办部门意见</td>
                  <td className={styles.val} height={100}>
                    <TableInput data={dataSource.shenLiGuanLi_yanQiShenLi_yiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_yanQiShenLi_yiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' style={{ width: '100%', height: 100 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
          <div>
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex', marginTop: 20 }}>
                <Form.Item style={{ display: 'flex' }} label='批办领导'>
                  {getFieldDecorator('shenLiGuanLi_jiWeiShuJi', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Select style={{ width: 200 }} onChange={this.selectChange}>
                      {leaderListItem}
                    </Select>
                  )}
                </Form.Item>
              </div>
            )}
          </div>
          <div className={styles.submitDiv} style={{ marginLeft: 750 }}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                返回
              </Button>
              <Button type='primary' className={styles.submitBtn} onClick={this.finshTask}>
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
