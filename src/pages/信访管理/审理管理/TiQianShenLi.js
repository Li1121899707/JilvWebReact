import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Upload } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'

const { Option } = Select

class TiQianShenLi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      leader: '',
      dataSource: {},
      leaderList: []
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data
        // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      })
      this.huoquhouxunaren()
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '填写商请提前介入审理审批表') {
      notification.error({ message: '该审批表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.shenLiGuanLi_status = '已填写商请提前介入审理'
        values.shenLiGuanLi_RiQi = new Date()
        if (err) return false
        let yijianArr = []
        if (this.state.dataSource.shenLiGuanLi_tiQianJieRuChengPi) {
          yijianArr = this.state.dataSource.shenLiGuanLi_tiQianJieRuChengPi
        }
        const obj = {
          name: window.USER.userName,
          type: '审理室意见',
          advise: values.shenLiGuanLi_niBanYiJian ? values.shenLiGuanLi_niBanYiJian : '',
          time,
          usercode: window.USER.userCode,
          leaderType: '登记人',
          link: `/admin/petition/management/show/${processInstanceId}/ShenPiTiQianShenLi`
        }
        yijianArr.push(obj)
        values.shenLiGuanLi_tiQianJieRuChengPi_files = this.fileRef.state.fileList
        values.wenTiXianSuo_status = '审理中'
        values.shenLiGuanLi_tiQianJieRuChengPi = yijianArr
        post(
          `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
          values
        ).then(res => {
          notification.success({ message: '提交成功' })
          router.goBack()
        })
      })
    }
  }

  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'shenLiGuanLi_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
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
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>提前介入审理意见呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label} width={150}>
                    线索来源
                  </td>
                  <td className={styles.val} height={48} width={500}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>呈批内容</td>
                  <td className={styles.val} height={48} colSpan={3}>
                    <TableInput data={dataSource.advisory}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_tiQianJieRu_chengPiNeiRong')(
                          <Input.TextArea size='large' style={{ width: '100%', height: 180 }} />
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>审理室意见</td>
                  <td className={styles.val} height={200} colSpan={3}>
                    <TableInput data={dataSource.advisory}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' style={{ width: '100%', height: 180 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
            <DisplayControlComponent>
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  fileList={dataSource.shenLiGuanLi_tiQianShenLi_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
          </Form>
          <div>
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex' }}>
                <Form.Item style={{ display: 'flex' }} label='批办领导'>
                  {getFieldDecorator('shenLiGuanLi_jiWeiShuJi', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Select style={{ width: 200 }} onChange={this.selectChange}>
                      {leaderListItem}
                    </Select>
                  )}
                </Form.Item>
              </div>
            )}
          </div>
          <div className={styles.submitDiv}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                返回
              </Button>
              <Button type='primary' className={styles.submitBtn} onClick={this.submit}>
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(TiQianShenLi)
export default wapper
