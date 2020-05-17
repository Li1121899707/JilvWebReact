import React, { Component } from 'react'
import { router } from 'umi'
import { Button, DatePicker, Form, Input, Select, Upload, notification, Radio } from 'antd'
import moment from 'moment'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post, put } from '@/utils/http'
import UploadComp from '@/components/upload/Upload'
import { isLeader } from '@/pages/信访管理/common/untils'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { exportFiles } from '@/utils/common'

const { Option } = Select
const ProcessDefinitionKey = 'nmnxxfj_v1'

class chuZhiXinFangJian extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      value: '自办',
      leaderList: [],
      leader: ''
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
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.huoquhouxunaren()
      this.setState({
        dataSource: res.data.form,
        data: res.data
      })
    })
  }

  selectChange = val => {
    this.setState({
      leader: val
    })
  }

  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'xinFangJian_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  submit = () => {
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName

    this.props.form.validateFields((err, values) => {
      let yijianArr = []
      if (this.state.dataSource.wenTiXianSuo_niBanYiJian) {
        yijianArr = this.state.dataSource.wenTiXianSuo_niBanYiJian
      }
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '拟办意见',
        advise: values.wenTiXianSuo_niBanYiJian ? values.wenTiXianSuo_niBanYiJian : '',
        time,
        link: `/admin/petition/clue/show/${processInstanceId}/lingdaoshenpi`,
        leaderType: '登记人'
      }
      yijianArr.push(obj)
      values.xinFangJian_yiJian = yijianArr
      values.status = '已呈批'
      values.attachment = this.fileRef.state.fileList
      console.log(values)
      if (err) return false

      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
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

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { dataSource, leaderList } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={style.title}>信访件拟办单</p>
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
              </tbody>
            </table>
            {this.type !== 'show' ? (
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  fileList={dataSource.attachment || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            ) : (
              <p style={{ textAlign: 'left' }}>
                相关附件:
                {dataSource.attachment &&
                  dataSource.attachment.map(item => (
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
            )}
            <div style={{ display: 'flex' }}>
              <TableInput data={dataSource.xinFangJian_chuLiFangShi}>
                <Form.Item style={{ display: 'flex', marginRight: 10 }} label='办理方式'>
                  {getFieldDecorator('xinFangJian_chuLiFangShi', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Radio.Group onChange={this.onChange}>
                      <Radio value='自办'>自办</Radio>
                      <Radio value='转办'>转办</Radio>
                      <Radio value='交办'>交办</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </TableInput>
            </div>

            {this.state.value !== '自办' && this.state.value !== '' ? (
              <div style={{ display: 'flex' }}>
                <TableInput data={dataSource.xinFangJian_gongSi}>
                  <Form.Item style={{ display: 'flex', marginRight: 10 }} label='转办/交办部门'>
                    {getFieldDecorator('xinFangJian_gongSi', {
                      rules: [{ required: true, message: '必填!' }]
                    })(<Input />)}
                  </Form.Item>
                </TableInput>
              </div>
            ) : null}
            <DisplayControlComponent>
              <div className={style.title}>
                <TableInput propsMode='add' data={dataSource.wenTiXianSuo_niBanYiJian}>
                  <Form.Item label='承办室意见：' style={{ display: 'flex' }}>
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

const wapper = Form.create()(chuZhiXinFangJian)
export default wapper
