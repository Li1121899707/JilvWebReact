/*
 * @author: 王志鹏
 * @Datetime  2020/2/20 13:49
 */
import React, { Component } from 'react'
import { Button, Form, Input, notification, Select, Upload } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'

const { Option } = Select

class WaiChaGongZuoTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      task: ''
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task
      for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
        if (!res.data.historicUserTaskInstanceList[i].ended) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          task
        },
        this.huoquhouxunaren
      )
    })
  }

  finshTask = () => {
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    post(`activiti/completeTask?taskId=${taskid}`, { IsTanHua: '否' }).then(res => {
      this.getTask()
    })
  }

  getTask = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task
      for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
        if (!res.data.historicUserTaskInstanceList[i].ended) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          task
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
    const { data, task, leader } = this.state

    this.props.form.validateFields((err, values) => {
      values.liAnDiaoCha_caoZuo = '外查'
      values.shenChaDiaoCha_waiCha_childstatus = '外查工作呈批表审批中'
      if (err) return false
      let yijianArr = []
      let waiChaArr = []
      let countWaiChaArr = []
      const WaiChaArrObj = {}
      if (this.state.dataSource.shenChaDiaoCha_yanQiWaiCha) {
        yijianArr = this.state.dataSource.shenChaDiaoCha_yanQiWaiCha
      }
      if (this.state.dataSource.shenChaDiaoCha_countWaiChaYiJian) {
        countWaiChaArr = this.state.dataSource.shenChaDiaoCha_countWaiChaYiJian
      }
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '外查申请承办室意见',
        advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
        time,
        leaderType: '登记人',
        link: `/admin/petition/investigation/${this.id}/${countWaiChaArr.length}/waichagongzuo`
      }
      yijianArr.push(obj)
      waiChaArr.push(obj)
      WaiChaArrObj.shenChaDiaoCha_waiChaYiJian = waiChaArr
      WaiChaArrObj.shenChaDiaoCha_waiChaGongZuo_files = this.fileRef.state.fileList
      countWaiChaArr.push(WaiChaArrObj)
      values.shenChaDiaoCha_yanQiWaiCha = yijianArr
      values.shenChaDiaoCha_waiChaYiJian = waiChaArr
      values.shenChaDiaoCha_countWaiChaYiJian = countWaiChaArr
      values.shenChaDiaoCha_waiChaGongZuo_files = this.fileRef.state.fileList
      post(`caseReview/handle?processInstanceId=${this.id}&taskId=${task.taskInstanceId}&assignee=${leader}`, values).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'LiAnShenCha_yanQi_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { leaderList, dataSource } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box_LiAn}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>外查工作方案呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被反映人姓名</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={styles.label}>单位</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
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
                  <td className={styles.label}>立案依据</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_liAnYiJu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>审查阶段需查明的问题</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_shenChaFangAn_wenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>承办室意见</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_niBanYiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Input.TextArea
                            placeholder='现已拟定了外查工作方案，请领导审阅。
xxx（承办室）                  xx年x月x日'
                            size='large'
                            rows={8}
                            allowClear
                          />
                        )}
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
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
          </Form>
          <div>
            <TableInput data={dataSource.wenTiXianSuo_shenPiLingDao}>
              <Form.Item style={{ display: 'flex' }} label='批办领导'>
                {getFieldDecorator('wenTiXianSuo_shenPiLingDao', {
                  rules: [{ required: true, message: '必填!' }]
                })(
                  <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                    {leaderListItem}
                  </Select>
                )}
              </Form.Item>
            </TableInput>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button
              style={{ marginRight: 20, marginTop: 20 }}
              onClick={() => {
                router.goBack()
              }}
            >
              返回
            </Button>
            <Button type='primary' onClick={dataSource.IsTanHua ? this.submit : this.finshTask}>
              提交保存
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(WaiChaGongZuoTable)
export default wapper
