/*
 * @author: 王志鹏
 * @Datetime  2020/2/20 15:41
 */
import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, Select, Timeline, notification, Tabs } from 'antd'
import moment from 'moment'
import { Link, router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '../common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import DefaultTemplate from '@/pages/信访管理/common/DefaultTemplate'
import { exportFiles } from '@/utils/common'

const { Option } = Select
const { TabPane } = Tabs

class chuZhiYiJianShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: { tanHuaHanXun_files: [] },
      data: {},
      leader: '',
      leaderList: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'tanHuaHanXun_tianXieYiJian'
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(async res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data,
        leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
        leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
        taskDefinitionKey: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      })
      //根据当前任务实例id指派下一任务审批人（传参传下一任务实例id）
      const taskGroup = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey)
      this.setState({
        leaderList,
        taskDefinitionKey
      })
    })
  }

  submit = () => {
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    let leader
    this.props.form.validateFields((err, values) => {
      let tanHuaArr = []
      let yijianArr = []
      if (this.state.dataSource.tanHuaHanXun_yiJian) {
        tanHuaArr = this.state.dataSource.tanHuaHanXun_yiJian
        yijianArr = this.state.dataSource.tanHuaHanXun_yiJian[tanHuaArr.length - 1].tanHuaHanXun_chuZhiYiJianChengPi
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '审批处置意见',
        advise: values.tanHuaHanXun_niBanYiJian ? values.tanHuaHanXun_niBanYiJian : '',
        time,
        leaderType
      }
      yijianArr.push(obj)
      tanHuaArr[tanHuaArr.length - 1].tanHuaHanXun_chuZhiYiJianChengPi = yijianArr
      values.tanHuaHanXun_yiJian = tanHuaArr
      //根据当前任务实例id传状态 党委书记审批时状态为已审批 纪委书记 承办领导是时状态为已填写拟办意见
      if (this.state.taskDefinitionKey === 'tanHuaHanXun_tianXieYiJian_dangWeiShuJi') {
        values.tanHuaHanXun_status = '处置意见已审批'
        if (this.state.dataSource.tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi === '转初步核实') {
          values.status = '初步核实'
          values.flow_path = `${this.state.dataSource.flow_path},初步核实`
          values.chuBuHeShi_status = '待填初核申请表'
        }
      } else {
        values.tanHuaHanXun_status = '处置意见审批中'
      }
      const me = this
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.tanHuaHanXun_status = '处置意见已审批'
          if (me.state.dataSource.tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi === '转初步核实') {
            values.status = '初步核实'
            values.flow_path = `${me.state.dataSource.flow_path},初步核实`
            values.chuBuHeShi_status = '待填初核申请表'
          }
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      if (err) return false
      //完成任务并指派下一任务审批人
      post(
        `thread/claimAndComplete?taskId=${
          this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        }&processInstanceId=${this.state.data.processInstanceId}&nextAssignee=${leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
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
    const { dataSource, leaderList, leaderOption_wenTiXianSUO, leaderOption_tanHuaHanXun, taskDefinitionKey } = this.state
    const files = dataSource.tanHuaHanXun_files
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))

    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>谈话函询处置意见</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <DefaultTemplate dataSource={dataSource} />
                <tr>
                  <td className={styles.label}>案件名称</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.tanHuaHanXun_anJianMingCheng} />
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
                                        console.log(itemList)
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
                    </Tabs>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {files.map(item => {
                return item.tanHuaHanXun_chuZhiYiJianChengPi_files.map(itemlist => (
                  <a
                    target='_blank'
                    key={Math.random()}
                    onClick={() => {
                      exportFiles(`${window.server}/api/files/${itemlist.response.path}`, itemlist.response.path)
                    }}
                  >
                    {itemlist.response.fileName}&emsp;
                  </a>
                ))
              })}
            </p>
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
                    {getFieldDecorator('wenTiXianSuo_shenPiLingDao', {
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
          </Form>
          <div />
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

const wapper = Form.create()(chuZhiYiJianShenPiTable)
export default wapper
