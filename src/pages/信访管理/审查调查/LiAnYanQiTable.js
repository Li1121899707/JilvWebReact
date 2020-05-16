/*
 * @author: 王志鹏
 * @Datetime  2020/2/20 14:01
 */

import React, { Component } from 'react'
import { Button, Form, Input, DatePicker, notification, Select } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'

class LiAnYanQiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      task: ''
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task = {}
      for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
        if (!res.data.historicUserTaskInstanceList[i].ended) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          task
        },
        this.huoquhouxunaren
      )
    })
  }

  finshTask = () => {
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    post(`activiti/completeTask?taskId=${taskid}`, { IsTanHua: '否' }).then(res => {
      this.getTask()
    })
  }

  getTask = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task
      for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
        if (!res.data.historicUserTaskInstanceList[i].ended) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          task
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
    const { data, task, leader } = this.state
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      values.liAnDiaoCha_caoZuo = '延期'
      values.shenChaDiaoCha_yanQi_childstatus = '工作延期呈批表审批中'
      if (err) return false
      let yijianArr = []
      let yanQiArr = []
      let countYanQiArr = []
      const YanQiArrObj = {}
      if (this.state.dataSource.shenChaDiaoCha_yanQiWaiCha) {
        yijianArr = this.state.dataSource.shenChaDiaoCha_yanQiWaiCha
      }
      if (this.state.dataSource.shenChaDiaoCha_countYanQiYiJian) {
        countYanQiArr = this.state.dataSource.shenChaDiaoCha_countYanQiYiJian
      }
      const obj = {
        name: window.USER.userName,
        type: '延期申请承办部门意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType: '登记人',
        link: `/admin/petition/investigation/${processInstanceId}/${countYanQiArr.length}/lianyanqi`
      }
      yijianArr.push(obj)
      yanQiArr.push(obj)
      YanQiArrObj.shenChaDiaoCha_yanQiYiJian = yanQiArr
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_shiXiang = values.shenChaDiaoCha_gongZuoYanQi_shiXiang
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_liYou = values.shenChaDiaoCha_gongZuoYanQi_liYou
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian = values.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian = values.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian
      YanQiArrObj.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian = values.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian
      countYanQiArr.push(YanQiArrObj)
      values.shenChaDiaoCha_yanQiWaiCha = yijianArr
      values.shenChaDiaoCha_yanQiYiJian = yanQiArr
      values.shenChaDiaoCha_countYanQiYiJian = countYanQiArr
      console.log(values)
      post(`caseReview/handle?processInstanceId=${this.id}&taskId=${task.taskInstanceId}&assignee=${leader}`, values).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'LiAnShenCha_yanQi_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { leaderList, dataSource } = this.state
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
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_gongZuoYanQi_shiXiang}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_gongZuoYanQi_shiXiang', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期理由</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_gongZuoYanQi_liYou}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_gongZuoYanQi_liYou', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>原要求完成时间</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期时间</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_gongZuoYanQi_yanQiShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期单位意见</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_gongZuoYanQi_danWeiYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>承办部门意见</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_niBanYiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Input.TextArea
                            placeholder='xx年x月x日内蒙古自治区农信社联合社纪委对xxx立案审查，现已拟定了立案审查方案，请领导审阅。'
                            size='large'
                            rows={8}
                            allowClear
                            style={{ width: 900 }}
                          />
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
          <div>
            <TableInput data={dataSource.wenTiXianSuo_shenPiLingDao}>
              <Form.Item style={{ display: 'flex' }} label='批办领导'>
                {getFieldDecorator('wenTiXianSuo_shenPiLingDao', {
                  rules: [{ required: true, message: '必填!' }]
                })(
                  <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                    {leaderListItem}
                  </Select>
                )}
              </Form.Item>
            </TableInput>
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
            <Button type='primary' onClick={dataSource.IsTanHua ? this.submit : this.finshTask}>
              提交保存
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(LiAnYanQiTable)
export default wapper
