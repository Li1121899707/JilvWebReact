import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Upload, Button, notification, Timeline } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import style from '../Index.less'
import TableInput from '../common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import styles from '@/pages/信访管理/Index.less'

const { Option } = Select

class YuYiLiaoJieLingDaoShenPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leader: '',
      leaderList: [],
      leaderOption: [],
      source: [
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
    this.type = this.props.match.params.type
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
      if (taskGroup === 'wenTiXianSuo_JieShuYiJian_chengBanLingDao') {
        taskId = 'wenTiXianSuo_JieShuYiJian_jiWeiShuJi'
      } else if (taskGroup === 'wenTiXianSuo_JieShuYiJian_jiWeiShuJi') {
        taskId = 'wenTiXianSuo_JieShuYiJian_dangWeiShuJi'
      } else if (taskGroup === 'wenTiXianSuo_JieShuYiJian_dangWeiShuJi') {
        taskId = null
      } else {
        taskId = 'wenTiXianSuo_JieShuYiJian_chengBanLingDao'
      }
      if (!taskId) return
      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
        this.setState({
          leaderList: res.data
        })
      })
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
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
      const obj = {
        name: window.USER.userName,
        type: '予以了结审批意见',
        advise: values.wenTiXianSuo_niBanYiJian ? values.wenTiXianSuo_niBanYiJian : '',
        time
      }
      yijianArr.push(obj)
      values.wenTiXianSuo_niBanYiJian = yijianArr
      const chuZhiFangShi = this.state.dataSource.wenTiXianSuo_chuZhiFangShi
      if (chuZhiFangShi === '予以了结') {
        values.wenTiXianSuo_status = '予以了结审批中'
      }
      if (taskGroup === 'wenTiXianSuo_JieShuYiJian_dangWeiShuJi') {
        values.wenTiXianSuo_status = '予以了结已审批'
      }
      if (err) return false
      console.log(values)
      //   //完成任务并指派下一审批人
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
      })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { leaderList, dataSource } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>中共内蒙古自治区农村信用社联合社检查委员会</p>
          <p className={style.title}>了结呈批表</p>
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
                  <td className={style.label}>了结理由及情况说明</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_liaoJieLiYou} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>协办/审批意见</td>
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
              </tbody>
            </table>
            <p className={style.title} style={{ textAlign: 'left' }}>
              查看附件: <Upload>《谈话函询情况报告》</Upload>
            </p>
            {this.type === 'add' && (
              <div className={styles.title}>
                <TableInput propsMode='add' data={dataSource.wenTiXianSuo_niBanYiJian}>
                  <Form.Item label='领导审批意见：' style={{ display: 'flex' }}>
                    {getFieldDecorator('wenTiXianSuo_niBanYiJian', {
                      rules: [{ required: true, message: '必填!' }]
                    })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 900 }} />)}
                  </Form.Item>
                </TableInput>
              </div>
            )}
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
          <div style={{ textAlign: 'center' }}>
            <Button type='primary' style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
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
    )
  }
}

const wapper = Form.create()(YuYiLiaoJieLingDaoShenPiTable)
export default wapper
