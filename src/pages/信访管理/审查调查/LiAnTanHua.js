import React, { Component } from 'react'
import { Link, router } from 'umi'
import DefaultTemplate from '@/pages/信访管理/common/DefaultTemplate'
import { get, post } from '@/utils/http'
import moment from 'moment'
import { Button, Form, Input, notification, Select, Tabs, Timeline } from 'antd'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'
import { concatForArr } from '@/utils/concat'

const { TabPane } = Tabs
const { Option } = Select

class LiAnTanHua extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: []
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      if (res.data.form.chuBuHeShi_chuHeBaoGaoChengPi) {
        res.data.form.chuBuHeShi_chuBuHeShiChengPi.push(...res.data.form.chuBuHeShi_chuHeBaoGaoChengPi)
      }
      const leaderOption_chuBuHeShi = res.data.form.chuBuHeShi_chuBuHeShiChengPi
      const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
        'shenChaDiaoCha_ChengPi',
        'shenChaDiaoCha_fangAnChengPi',
        'shenChaDiaoCha_yanQiWaiCha'
      ])

      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          leaderOption_chuBuHeShi,
          leaderOption_shenChaDiaoCha
        },
        this.huoquhouxunaren
      )
    })
  }

  submit = () => {
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data, task, leader } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '填写谈话呈批表') {
      notification.error({ message: '该谈话呈批表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.IsTanHua = '是'
        values.shenChaDiaoCha_status = '立案谈话已呈批'
        const yijianArr = []
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '处置意见',
          advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
          time,
          link: `/admin/petition/talk/show/${processInstanceId}/chuZhiYiJianShenPi`,
          leaderType: '登记人'
        }
        yijianArr.push(obj)
        values.shenChaDiaoCha_liAnTanHua = yijianArr
        values.shenChaDiaoCha_liAnTanHua_files = this.fileRef.state.fileList
        if (err) return false
        // console.log(values)
        post(`caseReview/handle?processInstanceId=${this.id}&taskId=${task.taskInstanceId}&assignee=${leader}`, values).then(res => {
          notification.success({ message: '提交成功' })
          router.goBack()
        })
      })
    }
  }

  finshTask = () => {
    const { data } = this.state
    const val = {}
    val.IsTanHua = '是'
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    post(`activiti/completeTask?taskId=${taskid}`, { isTanHua: '否' }).then(res => {
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

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'tanHuaHanXun_tianXieYiJian_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
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
    const {
      leaderList,
      dataSource,
      leaderOption_wenTiXianSUO,
      leaderOption_chuBuHeShi,
      leaderOption_tanHuaHanXun,
      leaderOption_shenChaDiaoCha
    } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))

    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>立案谈话呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <DefaultTemplate dataSource={dataSource} />
                <tr>
                  <td className={styles.label}>案件名称</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_anJianMingCheng}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_anJianMingCheng', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input placeholder='' size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>拟办/审批意见</td>
                  <td className={styles.val} colSpan={7}>
                    <Tabs defaultActiveKey='1' type='card' style={{ textAlign: 'left' }}>
                      <TabPane tab='问题线索' key='1'>
                        <Timeline mode='left'>
                          {leaderOption_wenTiXianSUO.map((item, index) => (
                            <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                              <div>
                                {item.name} {item.time}{' '}
                                {item.link && (
                                  <Link to={item.link} target='_blank'>
                                    详情
                                  </Link>
                                )}
                              </div>
                              <div className={styles.bold}>{item.type}：</div>
                              <div>{item.advise}</div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </TabPane>

                      {leaderOption_tanHuaHanXun.length > 0 ? (
                        <TabPane tab='谈话函询' key='2'>
                          <Tabs>
                            {leaderOption_tanHuaHanXun.map((item, index) => {
                              return (
                                <TabPane key={index} tab={`第${index + 1}次谈话函询`}>
                                  {item.tanHuaHanXun_chengPi.map((itemList, i) => {
                                    return (
                                      <Timeline.Item key={i} style={{ textAlign: 'left' }}>
                                        <div>
                                          {itemList.name} {itemList.time}{' '}
                                          {itemList.link && (
                                            <Link to={itemList.link} target='_blank'>
                                              详情
                                            </Link>
                                          )}
                                        </div>
                                        <div className={styles.bold}>{itemList.type}：</div>
                                        <div>{itemList.advise}</div>
                                      </Timeline.Item>
                                    )
                                  })}
                                  {item.tanHuaHanXun_chuZhiYiJianChengPi
                                    ? item.tanHuaHanXun_chuZhiYiJianChengPi.map((itemList, i) => {
                                        return (
                                          <Timeline.Item key={i} style={{ textAlign: 'left' }}>
                                            <div>
                                              {itemList.name} {itemList.time}{' '}
                                              {itemList.link && (
                                                <Link to={itemList.link} target='_blank'>
                                                  详情
                                                </Link>
                                              )}
                                            </div>
                                            <div className={styles.bold}>{itemList.type}：</div>
                                            <div>{itemList.advise}</div>
                                          </Timeline.Item>
                                        )
                                      })
                                    : null}
                                </TabPane>
                              )
                            })}
                          </Tabs>
                        </TabPane>
                      ) : null}
                      {leaderOption_chuBuHeShi.length > 0 ? (
                        <TabPane tab='初步核实' key='3'>
                          <Timeline mode='left'>
                            {leaderOption_chuBuHeShi.map((item, index) => (
                              <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                                <div>
                                  {item.name} {item.time}{' '}
                                  {item.link && (
                                    <Link to={item.link} target='_blank'>
                                      详情
                                    </Link>
                                  )}
                                </div>
                                <div className={styles.bold}>{item.type}：</div>
                                <div>{item.advise}</div>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </TabPane>
                      ) : null}

                      {leaderOption_shenChaDiaoCha.length > 0 ? (
                        <TabPane tab='审查调查' key='4'>
                          <Timeline mode='left'>
                            {leaderOption_shenChaDiaoCha.map((item, index) => (
                              <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                                <div>
                                  {item.name} {item.time}{' '}
                                  {item.link && (
                                    <Link to={item.link} target='_blank'>
                                      详情
                                    </Link>
                                  )}
                                </div>
                                <div className={styles.bold}>{item.type}：</div>
                                <div>{item.advise}</div>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </TabPane>
                      ) : null}
                    </Tabs>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>处置意见</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add'>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' rows={8} allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
            <DisplayControlComponent>
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  fileList={dataSource.tanHuaHanXun_chuZhiYiJian_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
          </Form>

          <div>
            <div style={{ display: 'flex' }}>
              <span>批办领导：</span>
              <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                {leaderListItem}
              </Select>
            </div>
          </div>
          <div className={styles.submitDiv} style={{ textAlign: 'center' }}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                取消
              </Button>
              <Button type='primary' className={styles.submitBtn} onClick={this.finshTask}>
                确定
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(LiAnTanHua)
export default wapper
