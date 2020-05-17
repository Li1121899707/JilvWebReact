import React, { Component } from 'react'
import { Button, Form, Input, Select, DatePicker, notification, Timeline, Tabs } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/文件上传/Index.less'
import { get, post } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import style from '@/pages/信访管理/Index.less'

const { Option } = Select
const { TabPane } = Tabs

class LiaoJieChengPiShenPi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: []
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
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
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_niBanYiJian ? res.data.form.tanHuaHanXun_niBanYiJian : []
        },
        this.huoquhouxunaren
      )
    })
  }

  submit = () => {
    // let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      let yijianArr = []
      if (this.state.dataSource.tanHuaHanXun_niBanYiJian) {
        yijianArr = this.state.dataSource.tanHuaHanXun_niBanYiJian
      }
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '了结呈批审批意见',
        advise: values.tanHuaHanXun_niBanYiJian ? values.tanHuaHanXun_niBanYiJian : '',
        time
      }
      yijianArr.push(obj)
      values.tanHuaHanXun_niBanYiJian = yijianArr
      if (err) return false
      const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_DangweiShuJi') {
        values.tanHuaHanXun_status = '了结呈批已审批'
      } else {
        values.tanHuaHanXun_status = '了结呈批审批中'
      }
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId
    const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
    if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_chengBanLingDao') {
      taskId = 'tanHuaHanXun_liaoJieChengQing_jiWeiShuJi'
    } else if (taskGroup === 'tanHuaHanXun_liaoJieChengQing_jiWeiShuJi') {
      taskId = 'tanHuaHanXun_liaoJieChengQing_DangweiShuJi'
    }
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
    const { dataSource, leaderList, leaderOption_wenTiXianSUO, leaderOption_tanHuaHanXun } = this.state
    const leaderListItem = leaderList.map((item, index) => <option value={item.userCode}>{item.userName}</option>)
    let groupedArray = []
    if (leaderOption_tanHuaHanXun % 9 !== 0) {
      groupedArray = this.group(leaderOption_tanHuaHanXun.slice(0, leaderOption_tanHuaHanXun.length - 1), 8) // 将谈话函询再次分组 8条记录为一组谈话记录
      if (groupedArray.length !== 0) {
        groupedArray[groupedArray.length - 1].push(...leaderOption_tanHuaHanXun.slice(leaderOption_tanHuaHanXun.length - 1))
      }
    } else {
      groupedArray = this.group(leaderOption_tanHuaHanXun, 8) // 将谈话函询再次分组 8条记录为一组谈话记录
    }
    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={style.title}>谈话函询了结呈批表</p>
          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>线索来源</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={style.label}>线索编号</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>收件日期</td>
                  <td className={style.val}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                  <td className={style.label}>反映人</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRen} />
                  </td>
                  <td className={style.label}>性别</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xingBie} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>政治面貌</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_zhengZhiMianMao} />
                  </td>
                  <td className={style.label}>联系电话</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_dianHua} />
                  </td>
                  <td className={style.label}>通讯地址</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_diZhi} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>工作单位</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>工作单位</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映主要问题</td>
                  <td className={style.val} colSpan={5}>
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
                                {item.name} {item.time}
                              </div>
                              <div className={styles.bold}>{item.type}：</div>
                              <div>{item.advise}</div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </TabPane>
                      {leaderOption_tanHuaHanXun.length > 0 ? (
                        <TabPane tab='谈话函询' key='2'>
                          {groupedArray.length <= 1 //如果分完组的数组为1 说明只谈话了一次
                            ? leaderOption_tanHuaHanXun.map((item, index) => (
                                <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                                <div>
                                    {item.name} {item.time}
                                  </div>
                                <div className={styles.bold}>{item.type}：</div>
                                <div>{item.advise}</div>
                              </Timeline.Item>
                              ))
                            : null}
                          {groupedArray.length > 1 ? ( //大于2 说明了再次进行了谈话函询
                            <Tabs>
                              {groupedArray.map((item, index) => {
                                return (
                                  <TabPane key={`2.${index + 1}`} tab={`第${index + 1}次谈话函询`}>
                                    {item.map((items, i) => {
                                      return (
                                        <Timeline.Item key={i} style={{ textAlign: 'left' }}>
                                          <div>
                                            {items.name} {items.time}
                                          </div>
                                          <div className={styles.bold}>{items.type}：</div>
                                          <div>{items.advise}</div>
                                        </Timeline.Item>
                                      )
                                    })}
                                  </TabPane>
                                )
                              })}
                            </Tabs>
                          ) : null}
                        </TabPane>
                      ) : null}
                    </Tabs>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex' }}>
              <p style={{ marginTop: 10 }}>上传附件：</p>
              <Button type='link' size='large'>
                《谈话函询情况报告》
              </Button>
            </div>
            {this.type === 'add' && (
              <div className={styles.title}>
                <TableInput propsMode='add' data={dataSource.tanHuaHanXun_niBanYiJian}>
                  <Form.Item label='审批意见：' style={{ display: 'flex' }}>
                    {getFieldDecorator('tanHuaHanXun_niBanYiJian', {
                      rules: [{ required: true, message: '必填!' }]
                    })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 900 }} />)}
                  </Form.Item>
                </TableInput>
              </div>
            )}
          </Form>
          <div>
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex' }}>
                <span>批办领导：</span>
                <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                  {leaderListItem}
                </Select>
              </div>
            )}
          </div>
          <div className={style.submitDiv} style={{ marginLeft: 750 }}>
            <div className={style.submitDiv}>
              <Button
                size='large'
                className={style.submitBtn}
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
      </div>
    )
  }
}

const wapper = Form.create()(LiaoJieChengPiShenPi)
export default wapper
