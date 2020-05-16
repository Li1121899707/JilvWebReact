/**
 * @Author 王志鹏
 * @Date 2020/4/15 15:08
 **/

import React, { Component } from 'react'
import { router } from 'umi'
import { Button, DatePicker, Form, Input, Select, Upload, notification, Radio, Timeline } from 'antd'
import moment from 'moment'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post, put } from '@/utils/http'
import UploadComp from '@/components/upload/Upload'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { formatLeader, isLeader, methodForIsLeader, untils } from '@/pages/信访管理/common/untils'
import { exportFiles } from '@/utils/common'

const { Option } = Select

const ProcessDefinitionKey = 'nmnxxfj_v1'

class RegisterTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      value: '自办',
      leaderList: [],
      taskDefinitionKey: '',
      leaderOption: []
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.letterSource = [`自治区纪委监委转`, '内蒙古银保监局转', '自治区联社领导转', '盟市纪委监委转', '公众号', '举报信箱', '其他']
    this.fanYingRen = ['自治区联社机关干部', '基层行社一把手', '基层行社其他班子成员', '基层行社环节干部', '基层行社其他人员', '单位']
    this.laiXin = [
      '呼和浩特市',
      '赤峰市',
      '呼伦贝尔市',
      '兴安盟',
      '通辽市',
      '乌兰察布市',
      '锡林郭勒盟',
      '包头市',
      '巴彦淖尔市',
      '阿拉善盟',
      '鄂尔多斯市',
      '乌海市'
    ]
    this.contextType = [
      `违规发放贷款以贷谋私`,
      '违规招录和提拔人员',
      '经商办企业',
      '违规基建',
      '违规装修房屋',
      '大宗物品采购',
      '工作作风问题',
      '诉求类',
      '其他违反八项规定精神的问题'
    ]
    this.statusKey = 'xinFangJian'
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
        leaderOption: res.data.form.xinFangJian_yiJian,
        taskDefinitionKey: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      })
      //根据当前任务实例id指派下一任务审批人（传参传下一任务实例id）
      const taskGroup = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey
      console.log(taskGroup)
      const { leaderList, taskDefinitionKey } = await untils(taskGroup, this.statusKey, ProcessDefinitionKey)
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
      let xinFangJian = []
      let yijianArr = []
      if (this.state.dataSource.xinFangJian_yiJian) {
        xinFangJian = this.state.dataSource.xinFangJian_yiJian
      }
      const leaderType = formatLeader(this.state.taskDefinitionKey, this.statusKey)
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '审批处置意见',
        advise: values.wenTiXianSuo_niBanYiJian ? values.wenTiXianSuo_niBanYiJian : '',
        time,
        leaderType
      }

      xinFangJian.push(obj)
      values.xinFangJian_yiJian = xinFangJian
      const taskGroup = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskDefinitionKey

      //根据当前任务实例id传状态 党委书记审批时状态为已审批 纪委书记 承办领导是时状态为已填写拟办意见
      if (taskGroup === 'xinFangJian_dangWeiShuJi') {
        values.status = '已审批'
      } else {
        values.status = '已审批'
      }
      methodForIsLeader(this.leader, this.statusKey, function(item, show, key) {
        if (show) {
          values.status = '已审批'
          leader = ''
        } else {
          values.status = '已审批'
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

  onChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  selectChange = (value, e) => {
    this.leader = value
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
          <p className={style.title}>信访件登记表</p>
          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>信访件来源</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.source}
                  </td>
                </tr>

                <tr>
                  <td className={style.label}>反映人</td>
                  <td className={style.val}>{dataSource.reporter}</td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>{dataSource.reporterUnit}</td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>{dataSource.reporterPost}</td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人</td>
                  <td className={style.val}>{dataSource.informee}</td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>{dataSource.informeeUnit}</td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>{dataSource.informeePost}</td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人分类</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.informeeClass}
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映问题类型</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.contentClass}
                  </td>
                </tr>

                <tr>
                  <td className={style.label}>信访件来源（地区）</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.sourceCity}
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>收到时间</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.recieveTime ? moment(dataSource.recieveTime).format('YYYY-MM-DD') : ''}
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>内容摘要</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.content}
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>处理方式</td>
                  <td className={style.val} colSpan={5}>
                    {dataSource.xinFangJian_chuLiFangShi}
                  </td>
                </tr>
                {dataSource.xinFangJian_gongSi && (
                  <tr>
                    <td className={style.label}>转交单位</td>
                    <td className={style.val} colSpan={5}>
                      {dataSource.xinFangJian_gongSi}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className={style.label}>拟办/审批意见</td>
                  <td className={style.val} colSpan={7}>
                    <Timeline mode='left'>
                      {this.state.leaderOption.map((item, index) => (
                        <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                          <div>
                            {item.name} {item.time}
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
              {dataSource.attachment &&
                dataSource.attachment.map(item => {
                  console.log(item.response)
                  return (
                    <a
                      target='_blank'
                      onClick={() => {
                        exportFiles(`${window.server}/api/files/${item.response.path}`,item.response.path)
                      }}
                    >
                      {item.response.fileName}&emsp;
                    </a>
                  )
                })}
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
                  <Form.Item style={{ display: 'flex' }} label='批办领导'>
                    {getFieldDecorator('xinFangJian_shenPiLingDao', {
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
          <div style={{ marginTop: 10 }}>
            <Button style={{ marginRight: 20 }} onClick={() => router.goBack()}>
              返回
            </Button>
            {this.type !== 'show' && (
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

const wapper = Form.create()(RegisterTable)
export default wapper
