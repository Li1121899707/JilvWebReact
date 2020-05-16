/*
 * @author: 王志鹏
 * @Datetime  2020/2/19 16:44
 */
import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, notification, Select, Timeline, Upload } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import { get, post } from '@/utils/http'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import { exportFiles } from '@/utils/common'

const { Option } = Select

class ZanCunLingDaoShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leader: '',
      leaderOption: [],
      leaderList: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'wenTiXianSuo_JieShuYiJian'
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(async res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data,
        leaderOption: res.data.form.wenTiXianSuo_niBanYiJian
        // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
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

    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const taskGroup = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
    const processInstanceId = this.state.data.processInstanceId
    this.props.form.validateFields((err, values) => {
      let yijianArr = []
      console.log(this.state.dataSource)
      if (this.state.dataSource.wenTiXianSuo_niBanYiJian) {
        yijianArr = this.state.dataSource.wenTiXianSuo_niBanYiJian
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '暂存待查领导审批',
        advise: values.wenTiXianSuo_niBanYiJian ? values.wenTiXianSuo_niBanYiJian : '',
        time,
        leaderType
      }
      yijianArr.push(obj)
      values.wenTiXianSuo_niBanYiJian = yijianArr
      const chuZhiFangShi = this.state.dataSource.wenTiXianSuo_chuZhiFangShi
      if (chuZhiFangShi === '暂存待查') {
        values.wenTiXianSuo_status = '暂存待查审批中'
      }
      if (taskGroup === 'wenTiXianSuo_JieShuYiJian_dangWeiShuJi') {
        values.wenTiXianSuo_status = '暂存待查已审批'
      }
      methodForIsLeader(this.state.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.wenTiXianSuo_status = '暂存待查已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })

      if (err) return false
      // 开始流程接口
      // post(`activiti/startProcess?processDefinitionKey=${processDefinitionKey}`, { ...values }).then(res => {
      //   const processInstanceId = res.data.processInstanceId
      //   //完成任务并指派下一审批人
      post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${leader}&isLocal=${0}`, values).then(
        res => {
          notification.success({ message: '提交成功' })
          router.goBack()
        }
      )
      // })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { dataSource, leaderList, taskDefinitionKey } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={style.title}>暂存待查呈批表</p>
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
                  <td className={style.val} colSpan={2}>
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
                  <td className={style.label}>拟办/审批意见</td>
                  <td className={style.val} colSpan={7}>
                    <Timeline mode='left'>
                      {this.state.leaderOption.map((item, index) => (
                        <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                          <div>
                            {item.name} {item.time}{' '}
                            {item.link && (
                              <Link to={item.link} target='_blank'>
                                详情
                              </Link>
                            )}
                          </div>
                          <div className={style.bold}>{item.type}：</div>
                          <div>{item.advise}</div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.wenTiXianSuo_zanCunDaiCha_files &&
                dataSource.wenTiXianSuo_zanCunDaiCha_files.map(item => (
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
              <div className={style.title}>
                <TableInput propsMode='add' data={dataSource.wenTiXianSuo_niBanYiJian}>
                  <Form.Item label='领导审批意见：' style={{ display: 'flex' }}>
                    {getFieldDecorator('wenTiXianSuo_niBanYiJian', {
                      rules: [{ required: true, message: '必填!' }]
                    })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 900 }} />)}
                  </Form.Item>
                </TableInput>
              </div>
              {/*根据下一任务候选人下拉列表判断是否掩藏下拉列表，下拉列表为空 表示下一任务没有候选人*/}
              {this.state.leaderList.length > 0 && (
                <div style={{ display: 'flex' }}>
                  <span>批办领导：</span>
                  <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                    {isLeader(taskDefinitionKey, this.statusKey)}
                    {leaderListItem}
                  </Select>
                </div>
              )}
            </DisplayControlComponent>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button type='primary' style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
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
const wapper = Form.create()(ZanCunLingDaoShenPiTable)
export default wapper
