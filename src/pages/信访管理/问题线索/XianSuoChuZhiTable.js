/*
 * @author: 王志鹏
 * @Datetime  2020/2/20 15:11
 */
import React, { Component } from 'react'
import { Button, Form, Input, Select, DatePicker, Upload, notification, Radio } from 'antd'
import { router } from 'umi'
import moment from 'moment'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import { get, post } from '@/utils/http'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'
import { exportFiles } from '@/utils/common'

const { Option } = Select

class XianSuoChuZhiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      value: '',
      leader: '',
      leaderList: [],
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
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.huoquhouxunaren()
      this.setState({
        dataSource: res.data.form,
        data: res.data
      })
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'wenTiXianSuo_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '线索处置') {
      notification.error({ message: '该线索处置表已提交' })
    } else {
      this.props.form.validateFields((err, values) => {
        let yijianArr = []
        console.log(this.state.dataSource)
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
        values.wenTiXianSuo_niBanYiJian = yijianArr
        values.wenTiXianSuo_status = '已登记'
        values.xianSuoChuZhi_files = this.fileRef.state.fileList
        console.log(values)
        if (err) return false
        //完成任务
        // post(`activiti/completeTask?taskId=${taskid}`, values).then(res => {
        //   notification.success({ message: '提交成功' })
        // })

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

  onChange = e => {
    this.setState({
      value: e.target.value
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
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
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
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_dianHua}>
                      <Form.Item>{getFieldDecorator('wenTiXianSuo_dianHua')(<Input size='large' placeholder='' allowClear={false} />)}</Form.Item>
                    </TableInput>
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
                  <td className={styles.label}>拟办意见</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_niBanYiJian}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' rows={8} allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.wenTiXianSuo_files &&
                dataSource.wenTiXianSuo_files.map(item => (
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
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  fileList={dataSource.xianSuoChuZhi_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>

            <div>
              <TableInput data={dataSource.wenTiXianSuo_chuZhiFangShi}>
                <Form.Item style={{ marginTop: 10, display: 'flex' }} label='处置方式：'>
                  {getFieldDecorator('wenTiXianSuo_chuZhiFangShi', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Select allowClear style={{ width: 200 }}>
                      <Option value='谈话函询'>谈话函询</Option>
                      <Option value='初步核实'>初步核实</Option>
                      <Option value='暂存待查'>暂存待查</Option>
                      <Option value='予以了结'>予以了结</Option>
                    </Select>
                  )}
                </Form.Item>
              </TableInput>
            </div>

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
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
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

const wapper = Form.create()(XianSuoChuZhiTable)
export default wapper
