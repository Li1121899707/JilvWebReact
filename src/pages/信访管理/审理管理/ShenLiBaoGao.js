import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Upload } from 'antd'
import { router } from 'umi'
import moment from 'moment'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import UploadComp from '@/components/upload/Upload'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'

const { Option } = Select

class ShenLiBaoGao extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: ''
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
    this.huoquhouxunaren()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data
        // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      })
    })
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

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  finshTask = () => {
    const { data } = this.state
    let taskid = ''
    for (let i = data.historicUserTaskInstanceList.length; i > 0; i--) {
      if (!data.historicUserTaskInstanceList[i - 1].ended && data.historicUserTaskInstanceList[i - 1].taskName === '发起延期申请或直接填写审理报告') {
        taskid = data.historicUserTaskInstanceList[i - 1].taskInstanceId
      }
    }

    post(`activiti/completeTask?taskId=${taskid}`, { shenLiGuanLi_caoZuo: '报告' }).then(res => {
      this.getTask()
    })
  }

  getTask = () => {
    const { data } = this.state
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      const taskid = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data
          // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        },
        () => {
          this.submit()
        }
      )
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state

    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '填写审理报告呈批表') {
      notification.error({ message: '该呈批表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.shenLiGuanLi_status = '已填写审理报告呈批表'
        values.shenLiGuanLi_yanQiShenLi_shenQingShiJian = values.shenLiGuanLi_yanQiShenLi_shenQingShiJian
          ? values.shenLiGuanLi_yanQiShenLi_shenQingShiJian.format('YYYY-MM-DD')
          : ''
        if (err) return false
        let yijianArr = []
        if (this.state.dataSource.shenLiGuanLi_shenLiBaoGaoChengPi) {
          yijianArr = this.state.dataSource.shenLiGuanLi_shenLiBaoGaoChengPi
        }
        const obj = {
          name: window.USER.userName,
          type: '审理意见',
          advise: values.shenLiGuanLi_niBanYiJian ? values.shenLiGuanLi_niBanYiJian : '',
          time,
          usercode: window.USER.userCode,
          leaderType: '登记人',
          link: `/admin/petition/management/show/${processInstanceId}/ShenYueShenLiBaoGao`
        }
        yijianArr.push(obj)
        values.shenLiGuanLi_shenLiBaoGaoChengPi_files = this.fileRef.state.fileList
        values.shenLiGuanLi_shenLiBaoGaoChengPi = yijianArr
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

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}> 审理报告呈批表</p>
          <Form>
            <table className={styles.table} style={{ width: 950 }}>
              <tbody>
                <tr>
                  <td className={styles.label} style={{ width: 200 }}>
                    线索来源
                  </td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>案件名称</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.tanHuaHanXun_anJianMingCheng} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>审理意见</td>
                  <td className={styles.val} height={180}>
                    <TableInput data={dataSource.shenLiGuanLi_shenLiBaoGao_shenLiYiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenLiGuanLi_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' rows={8} style={{ width: 850 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
          <DisplayControlComponent>
            <div style={{ textAlign: 'left' }}>
              <UploadComp
                key={dataSource.wenTiXianSuo_xuHao || 0}
                fileList={dataSource.shenLiGuanLi_shenLiBaoGao_files || []}
                ref={ref => {
                  this.fileRef = ref
                }}
              />
            </div>
          </DisplayControlComponent>

          <div>
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex', marginTop: 20 }}>
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
              <Button type='primary' className={styles.submitBtn} onClick={this.finshTask}>
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(ShenLiBaoGao)
export default wapper
