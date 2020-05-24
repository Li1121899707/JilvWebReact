// 组织机构下拉树
import React, { Component } from 'react'
import { Form, Select, Input, DatePicker, Button, notification, Timeline, Tabs } from 'antd'
import moment from 'moment'
import { Link, router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '../common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { concatForArr } from '@/utils/concat'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import { exportFiles } from '@/utils/common'

const { Option } = Select
const { TabPane } = Tabs

class LiAnShenChaChengPiShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'LiAnShenCha'
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

      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          leaderOption_chuBuHeShi,
          leaderOption_shenChaDiaoCha: res.data.form.shenChaDiaoCha_ChengPi ? res.data.form.shenChaDiaoCha_ChengPi : [],
          taskDefinitionKey: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
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
      if (taskGroup === 'LiAnShenCha_dangWeiShuJi') {
        values.shenChaDiaoCha_status = '已审批'
      } else {
        values.shenChaDiaoCha_status = '审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.shenChaDiaoCha_status = '已审批'
          values.liAnChengPi_status = '已审批'
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
      if (this.state.dataSource.shenChaDiaoCha_ChengPi) {
        yijianArr = this.state.dataSource.shenChaDiaoCha_ChengPi
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
      values.shenChaDiaoCha_ChengPi = yijianArr
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
    const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
    const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey)
    this.setState({
      leaderList,
      taskDefinitionKey
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
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
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>

          <p className={styles.title}>立案审查呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>被审(调查)人姓名/单位/事件/事故</td>
                  <td className={styles.val} colSpan={7}>
                    {dataSource.wenTiXianSuo_beiFanYingRen}/{dataSource.wenTiXianSuo_beiFanYingRenDanWei}/{dataSource.shenChaDiaoCha_weiJiWenTi}/
                    {dataSource.wenTiXianSuo_beiFanShiGu}
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label}>民族</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                  <td className={styles.label}>学历</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXueLi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>出生年月</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_beiFanYingRenBorn ? moment(dataSource.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>入党时间</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位及职务(包括兼职)</td>
                  <td className={styles.val} colSpan={7}>
                    {dataSource.wenTiXianSuo_beiFanYingRenDanWei}/{dataSource.wenTiXianSuo_beiFanYingRenZhiWu}
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>职级</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiJi} />
                  </td>
                  <td className={styles.label}>问题线索来源</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>证件类型</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengJianLeiXing} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>证件号码</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengJianLeiXing} />
                  </td>
                  <td className={styles.label}>是否国家监察对象</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_isGuoJiaJianCha} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>一把手违纪违法</td>
                  <td className={styles.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_yiBaShou} />
                  </td>
                </tr>
                <tr>
                  <td>是否党代表(何级)</td>
                  <td>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_isDangDaiBiao} />
                  </td>
                  <td className={styles.label}>是否人大代表(何级)</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_isRenDaDaiBiao} />
                  </td>
                  <td className={styles.label}>是否政协委员(何级)</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_isZhengXieWeiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>主要问题</td>
                  <td className={styles.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_weiJiWenTi} />
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
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.shenChaDiaoCha_ChengPi_files &&
                dataSource.shenChaDiaoCha_ChengPi_files.map(item => (
                  <a
                    target='_blank'
                    onClick={() => {
                      exportFiles(`${window.server}/api/files/${item.response.path}`, item.response.path)
                    }}
                  >
                    {item.response.fileName}&emsp;
                  </a>
                ))}
              {dataSource.shangChuanHuiZhi_files &&
                dataSource.shangChuanHuiZhi_files.map(item => (
                  // 修改的exportFiles
                  <a target='_blank' href={exportFiles(`${window.server}/api/files/${item.response.path}`), item.response.path}>
                    {item.response.fileName}&emsp;
                  </a>
                ))}
            </p>
            <DisplayControlComponent>
              <div className={styles.title}>
                <TableInput data={dataSource.shenChaDiaoCha_niBanYiJian}>
                  <Form.Item label='领导审阅意见' style={{ display: 'flex' }}>
                    {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                      rules: [{ required: true, message: '必填!' }]
                    })(<Input.TextArea size='large' rows={8} allowClear style={{ width: 900 }} />)}
                  </Form.Item>
                </TableInput>
              </div>
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
            </DisplayControlComponent>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
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
    )
  }
}

const wapper = Form.create()(LiAnShenChaChengPiShenPiTable)
export default wapper
