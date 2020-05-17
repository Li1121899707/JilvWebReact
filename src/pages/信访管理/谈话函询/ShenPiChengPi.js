import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Timeline, Tabs } from 'antd'
import moment from 'moment'
import { Link, router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import { exportFiles } from '@/utils/common'

const { Option } = Select
const { TabPane } = Tabs

class ShenPiChengPi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: { tanHuaHanXun_files: [] },
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'tanHuaHanXun'
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
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          taskDefinitionKey: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
        },
        this.huoquhouxunaren
      )
    })
  }

  submit = () => {
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    let leader
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      if (this.state.taskDefinitionKey === 'tanHuaHanXun_dangWeiShuJi') {
        values.tanHuaHanXun_status = '已审批'
      } else {
        values.tanHuaHanXun_status = '审批中'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.tanHuaHanXun_status = '已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })
      let tanHuaArr = []
      let yijianArr = []
      if (this.state.dataSource.tanHuaHanXun_yiJian) {
        tanHuaArr = this.state.dataSource.tanHuaHanXun_yiJian
        yijianArr = this.state.dataSource.tanHuaHanXun_yiJian[tanHuaArr.length - 1].tanHuaHanXun_chengPi
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const arrObj = {}
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '审批意见',
        advise: values.tanHuaHanXun_niBanYiJian ? values.tanHuaHanXun_niBanYiJian : '',
        time,
        leaderType
      }
      yijianArr.push(obj)
      arrObj.tanHuaHanXun_chengPi = yijianArr
      tanHuaArr[tanHuaArr.length - 1] = arrObj
      values.tanHuaHanXun_yiJian = tanHuaArr
      if (err) return false
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
        <div className={styles.content_box_LiAn}>
          <p className={styles.title}>中共内蒙古自治区农村信用社联合社纪律检查委员会</p>
          <p className={styles.title}>谈话函询呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>谈话函询对象</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={styles.label}>单位</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label}>年龄</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenNianLing} />
                  </td>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>民族</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>反应的主要问题摘要</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
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
                    </Tabs>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {files.map(item => {
                return item.tanHuaHanXun_chengPi_files.map(itemlist => (
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
              {this.state.leaderList.length > 0 && (
                <div>
                  <TableInput data={dataSource.wenTiXianSuo_shenPiLingDao}>
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
                  </TableInput>
                </div>
              )}
            </DisplayControlComponent>
          </Form>
          <div className={styles.submitDiv} style={{ textAlign: 'center' }}>
            <div className={styles.submitDiv}>
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
      </div>
    )
  }
}

const wapper = Form.create()(ShenPiChengPi)
export default wapper
