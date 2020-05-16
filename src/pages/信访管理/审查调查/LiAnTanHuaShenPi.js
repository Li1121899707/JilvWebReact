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
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'

const { TabPane } = Tabs
const { Option } = Select

class LiAnTanHuaShenPi extends Component {
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
      leaderOption_shenChaDiaoCha: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'LiAnShenCha_tanHua'
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
      console.log(leaderOption_chuBuHeShi)
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
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    let leader
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'LiAnShenCha_tanHua_dangWeiShuJi') {
        values.shenChaDiaoCha_status = '立案谈话呈批已审批'
      } else {
        values.shenChaDiaoCha_status = '立案谈话呈批审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_status = '立案谈话呈批已审批'
          leader = ''
        } else {
          leader = key
        }
        values.IsLingDao = '是'
        item.forEach(itemObj => {
          if (itemObj.value === '否') {
            values.IsLingDao = '否'
          }
        })
      })

      if (err) return false
      let yijianArr = []
      if (this.state.dataSource.shenChaDiaoCha_liAnTanHua) {
        yijianArr = this.state.dataSource.shenChaDiaoCha_liAnTanHua
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '领导审阅意见',
        usercode: window.USER.userCode,
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        leaderType
      }
      yijianArr.push(obj)
      values.shenChaDiaoCha_liAnTanHua = yijianArr
      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
        res => {
          notification.success({ message: '提交成功' })
          router.goBack()
        }
      )
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = async () => {
    let processDefinitionKey = ProcessDefinitionKey
    const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
    console.log(taskGroup)
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
    const {
      leaderList,
      dataSource,
      leaderOption_wenTiXianSUO,
      leaderOption_chuBuHeShi,
      leaderOption_tanHuaHanXun,
      leaderOption_shenChaDiaoCha,
      taskDefinitionKey
    } = this.state
    console.log(leaderOption_chuBuHeShi)
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
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_anJianMingCheng} />
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

          <DisplayControlComponent>
            <div className={styles.title}>
              <TableInput propsMode='add'>
                <Form.Item label='领导审批意见：' style={{ display: 'flex' }}>
                  {getFieldDecorator('tanHuaHanXun_niBanYiJian', {
                    rules: [{ required: true, message: '必填!' }]
                  })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 900 }} />)}
                </Form.Item>
              </TableInput>
            </div>
            {/*根据下一任务候选人下拉列表判断是否掩藏下拉列表，下拉列表为空 表示下一任务没有候选人*/}
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex' }}>
                <Form.Item style={{ display: 'flex' }} label='批办领导'>
                  {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
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
          </DisplayControlComponent>
          <div className={styles.submitDiv} style={{ textAlign: 'center' }}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                取消
              </Button>
              <Button type='primary' className={styles.submitBtn} onClick={this.submit}>
                确定
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(LiAnTanHuaShenPi)
export default wapper
