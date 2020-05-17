import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, Select, Timeline, notification } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '../common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'

const { Option } = Select

class LingDaoShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leader: '',
      leaderList: [],
      leaderOption: [],
      taskDefinitionKey: ''
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.statusKey = 'wenTiXianSuo'
    this.leader = ''
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
      let yijianArr = []
      if (this.state.dataSource.wenTiXianSuo_niBanYiJian) {
        yijianArr = this.state.dataSource.wenTiXianSuo_niBanYiJian
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        type: '审批意见',
        usercode: window.USER.userCode,
        advise: values.wenTiXianSuo_niBanYiJian ? values.wenTiXianSuo_niBanYiJian : '',
        time,
        leaderType
      }
      yijianArr.push(obj)
      values.wenTiXianSuo_niBanYiJian = yijianArr
      //根据当前任务实例id传状态 党委书记审批时状态为已审批 纪委书记 承办领导是时状态为已填写拟办意见
      if (this.state.taskDefinitionKey === 'wenTiXianSuo_dangWeiShuJi') {
        values.wenTiXianSuo_status = '已审批'
      } else {
        values.wenTiXianSuo_status = '审批中'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.wenTiXianSuo_status = '已审批'
          leader = ''
        } else {
          leader = key
        }
        item.forEach(itemObj => {
          values[itemObj.type] = itemObj.value
        })
      })
      //完成任务并指派下一任务审批人
      post(
        `thread/claimAndComplete?taskId=${
          this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        }&processInstanceId=${this.state.data.processInstanceId}&nextAssignee=${leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
      })
    })
  }

  selectChange = (value, e) => {
    this.leader = value
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList, taskDefinitionKey } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>中共内蒙古自治区农村信用社联合社检查委员会</p>
          <p className={styles.title}>问题线索登记表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>收件日期</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                  <td className={styles.label}>反应人</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRen} />
                  </td>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xingBie} />
                  </td>
                </tr>

                <tr>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_zhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>联系电话</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_dianHua} />
                  </td>
                  <td className={styles.label}>通信地址</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_diZhi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenDanWei} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被反映人</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>反应主要问题</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>拟办/审批意见</td>
                  <td className={styles.val} colSpan={7}>
                    <Timeline mode='left'>
                      {this.state.leaderOption.map((item, index) => (
                        <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                          <div>
                            {item.name} {item.time}
                          </div>
                          <div className={styles.bold}>{item.type}：</div>
                          <div>{item.advise}</div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>拟办方式</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_chuLiFangShi} />
                  </td>
                  <td className={styles.label}>转办/交办/督办/协调单位</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_chuLiFangShi_buMen} />
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.wenTiXianSuo_files &&
                dataSource.wenTiXianSuo_files.map(item => (
                  <a target='_blank' href={`${window.server}/api/files/${item.response.path}`}>
                    {item.response.fileName}&emsp;
                  </a>
                ))}
              {dataSource.xianSuoChuZhi_files &&
                dataSource.xianSuoChuZhi_files.map(item => (
                  <a target='_blank' href={`${window.server}/api/files/${item.response.path}`}>
                    {item.response.fileName}&emsp;
                  </a>
                ))}
            </p>
            <DisplayControlComponent>
              <div className={styles.title}>
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

const wapper = Form.create()(LingDaoShenPiTable)
export default wapper
