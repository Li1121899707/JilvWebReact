import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Timeline, Upload, Tabs } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { concatForArr } from '@/utils/concat'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import { exportFiles } from '@/utils/common'

const { Option } = Select
const { TabPane } = Tabs

class ShenPiTiQianShenLi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      leaderOption_shenLiGuanLi: [],
      leaderList: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'shenLiGuanLi'
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      const leaderOption_shenLiGuanLi = concatForArr(res.data.form, [
        'shenLiGuanLi_tiQianJieRuChengPi',
        'shenLiGuanLi_countYanQiYiJian',
        'shenLiGuanLi_shenLiBaoGaoChengPi'
      ])

      const leaderOption_chuBuHeShi = concatForArr(res.data.form, ['chuBuHeShi_chuBuHeShiChengPi', 'chuBuHeShi_chuHeBaoGaoChengPi'])
      const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
        'shenChaDiaoCha_ChengPi',
        'shenChaDiaoCha_fangAnChengPi',
        'shenChaDiaoCha_yanQiWaiCha',
        'shenChaDiaoCha_baoGaoChengPi',
        'shenChaDiaoCha_tiQianJieRu',
        'shenChaDiaoCha_anJianYiSong'
      ])
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          leaderOption_chuBuHeShi,
          leaderOption_shenChaDiaoCha,
          leaderOption_shenLiGuanLi,
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
    const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey)
    this.setState({
      leaderList,
      taskDefinitionKey
    })
  }

  submit = () => {
    // let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    let leader
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      let yijianArr = []
      if (this.state.dataSource.shenLiGuanLi_tiQianJieRuChengPi) {
        yijianArr = this.state.dataSource.shenLiGuanLi_tiQianJieRuChengPi
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '提前介入审理审批意见',
        advise: values.shenLiGuanLi_niBanYiJian ? values.shenLiGuanLi_niBanYiJian : '',
        time,
        usercode: window.USER.userCode,
        leaderType
      }
      yijianArr.push(obj)
      values.shenLiGuanLi_tiQianJieRuChengPi = yijianArr
      if (err) return false
      const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'shenLiGuanLi_dangWeiShuJi') {
        values.shenLiGuanLi_status = '提前介入审理已审批'
      } else {
        values.shenLiGuanLi_status = '提前介入审理审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenLiGuanLi_status = '提前介入审理已审批'
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
      dataSource,
      leaderOption_wenTiXianSUO,
      leaderOption_chuBuHeShi,
      leaderOption_shenLiGuanLi,
      leaderOption_tanHuaHanXun,
      leaderOption_shenChaDiaoCha,
      leaderList,
      taskDefinitionKey
    } = this.state
    console.log(leaderOption_shenLiGuanLi)
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>提前介入审理意见呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label} width={150}>
                    线索来源
                  </td>
                  <td className={styles.val} height={48} width={500}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>呈批内容</td>
                  <td className={styles.val} height={48} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_tiQianJieRu_chengPiNeiRong} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>意见</td>
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
                      {leaderOption_shenLiGuanLi.length > 0 ? (
                        <TabPane tab='审理管理' key='5'>
                          <Timeline mode='left'>
                            {leaderOption_shenLiGuanLi.map((item, index) => (
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

            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.shenLiGuanLi_tiQianJieRuChengPi_files &&
                dataSource.shenLiGuanLi_tiQianJieRuChengPi_files.map(item => (
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
            <DisplayControlComponent>
              <div style={{ marginTop: 30, display: 'flex' }}>
                <p>分管审理领导意见/分管审批领导意见：</p>
                <div>
                  <TableInput data={dataSource.advisory}>
                    <Form.Item>
                      {getFieldDecorator('shenLiGuanLi_niBanYiJian', {
                        rules: [{ required: true, message: '必填!' }]
                      })(<Input.TextArea size='large' rows={8} style={{ width: 850 }} />)}
                    </Form.Item>
                  </TableInput>
                </div>
              </div>
            </DisplayControlComponent>
          </Form>
          <DisplayControlComponent>
            <div>
              {this.state.leaderList.length > 0 && (
                <div style={{ display: 'flex', marginTop: 20 }}>
                  <Form.Item style={{ display: 'flex' }} label='批办领导'>
                    {getFieldDecorator('shenLiGuanLi_jiWeiShuJi', {
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
          </DisplayControlComponent>
          <div className={styles.submitDiv}>
            <div className={styles.submitDiv}>
              <Button
                className={styles.submitBtn}
                style={{ marginRight: 20, marginTop: 20 }}
                onClick={() => {
                  router.goBack()
                }}
              >
                返回
              </Button>
              <DisplayControlComponent>
                <Button type='primary' onClick={this.submit}>
                  提交保存
                </Button>
              </DisplayControlComponent>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(ShenPiTiQianShenLi)
export default wapper
