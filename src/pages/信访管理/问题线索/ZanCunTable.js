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
import UploadComp from '@/components/upload/Upload'

const { Option } = Select

class ZanCunTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leader: '',
      leaderOption: [],
      leaderList: [],
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
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    let processDefinitionKey = ProcessDefinitionKey
    const taskId = 'wenTiXianSuo_JieShuYiJian_jiJianJianChaShi'
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        dataSource: res.data.form,
        data: res.data,
        leaderOption: res.data.form.wenTiXianSuo_niBanYiJian
        // taskid: res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      })

      get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(result => {
        this.setState({
          leaderList: result.data
        })
      })
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const taskid = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = this.state.data.processInstanceId
    const taskName = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '填写暂存待查表') {
      notification.error({ message: '暂存待查表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        let yijianArr = []
        if (this.state.dataSource.wenTiXianSuo_niBanYiJian) {
          yijianArr = this.state.dataSource.wenTiXianSuo_niBanYiJian
        }
        const obj = {
          name: window.USER.userName,
          type: '暂存待查理由及情况说明',
          advise: values.wenTiXianSuo_zanCunLiYou ? values.wenTiXianSuo_zanCunLiYou : '',
          time,
          link: `/admin/petition/clue/show/${processInstanceId}/ZanCunLingDaoShenPi`,
          leaderType: '登记人'
        }
        yijianArr.push(obj)
        values.wenTiXianSuo_niBanYiJian = yijianArr
        const chuZhiFangShi = this.state.dataSource.wenTiXianSuo_chuZhiFangShi
        if (chuZhiFangShi === '暂存待查') {
          values.wenTiXianSuo_status = '暂存待查已登记'
        }
        values.wenTiXianSuo_zanCunDaiCha_files = this.fileRef.state.fileList
        if (err) return false
        console.log(values)
        // 开始流程接口
        // post(`activiti/startProcess?processDefinitionKey=${processDefinitionKey}`, { ...values }).then(res => {
        //   const processInstanceId = res.data.processInstanceId
        //   //完成任务并指派下一审批人
        post(
          `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
          values
        ).then(res => {
          notification.success({ message: '提交成功' })
          router.goBack()
        })
        // })
      })
    }
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { dataSource, leaderList } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
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
            <DisplayControlComponent>
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  fileList={dataSource.wenTiXianSuo_zanCunDaiCha_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
            <div>
              <TableInput data={dataSource.wenTiXianSuo_zanCunLiYou}>
                <Form.Item label='暂存待查理由及情况说明：' style={{ display: 'flex' }}>
                  {getFieldDecorator('wenTiXianSuo_liaoJieLiYou', {
                    rules: [{ required: true, message: '必填!' }]
                  })(<Input.TextArea size='large' rows={8} allowClear style={{ width: 870 }} />)}
                </Form.Item>
              </TableInput>
            </div>
            {/*根据下一任务候选人下拉列表判断是否掩藏下拉列表，下拉列表为空 表示下一任务没有候选人*/}
            {this.state.leaderList.length > 0 && (
              <div style={{ display: 'flex', marginLeft: '4.4%' }}>
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
            <Button type='primary' onClick={this.submit}>
              提交保存
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
const wapper = Form.create()(ZanCunTable)
export default wapper
