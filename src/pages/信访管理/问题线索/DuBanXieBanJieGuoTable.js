import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, Select, Timeline, notification } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '../common/aboutActiviti'

const { Option } = Select

class DuBanXieBanJieGuoTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leaderList: [],
      leaderOption: [],
      sourceList: [
        '信访举报',
        '上级交办',
        '公检法机关移交',
        '监督检查中发现',
        '审查调查中发现',
        '审计中发现',
        '巡视巡查中发现',
        '其他行政执法机关移交',
        '其他'
      ]
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data,
        leaderOption: res.data.form.wenTiXianSuo_niBanYiJian
        // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      })
      //根据当前任务实例id指派下一任务审批人（传参传下一任务实例id）
      const taskGroup = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      if (taskGroup === 'wenTiXianSuo_chengBanLingDao') {
        taskId = 'wenTiXianSuo_jiWeiShuJi'
      } else if (taskGroup === 'wenTiXianSuo_jiWeiShuJi') {
        taskId = 'wenTiXianSuo_dangWeiShuJi'
      }
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.setState({
          leaderList: res.data
        })
      })
    })
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      let val = {}
      if (err) return false
      val.wenTiXianSuo_banLiJieGuo = values.wenTiXianSuo_banLiJieGuo
      val.wenTiXianSuo_status = '已填办理结果'
      console.log()
      //完成任务并指派下一任务审批人
      post(
        `activiti/completeTask?taskId=${this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId}`,
        val
      ).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
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
            <div style={{ marginTop: 20, display: 'flex' }}>
              <p>查看附件:</p>
              <Button type='link'>《上级纪委转交办单》</Button>
              <Button type='link'>《信访举报材料》</Button>
              <Button type='link'>《电话投诉举报记录》</Button>
              <Button type='link'>《其他职能部门/司法机关移送文书》</Button>
            </div>
            <div className={styles.title}>
              <TableInput data={dataSource.wenTiXianSuo_banLiJieGuo}>
                <Form.Item label='办理结果：' style={{ display: 'flex' }}>
                  {getFieldDecorator('wenTiXianSuo_banLiJieGuo', {
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
                  {leaderListItem}
                </Select>
              </div>
            )}
          </Form>
          <div />
          <div style={{ textAlign: 'center' }}>
            <Button type='primary' style={{ marginRight: 20, marginTop: 20 }}>
              返回
            </Button>
            <Button type='primary' onClick={this.submit}>
              提交保存
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(DuBanXieBanJieGuoTable)
export default wapper
