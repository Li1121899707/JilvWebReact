import React, { Component } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, Timeline } from 'antd'
import moment from 'moment'
import style from '@/pages/信访管理/Index.less'
// import ArchivesInput from '@/pages/文件上传/common/ArchivesInput'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import { router } from 'umi'

const { Option } = Select

class LiaoJieChengPi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption: []
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption: res.data.form.chuBuHeShi_chengPiYiJian
        },
        this.huoquhouxunaren
      )
    })
  }

  submit = () => {
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    this.props.form.validateFields((err, values) => {
      if (err) return false
      let yijianArr = []
      if (this.state.dataSource.chuBuHeShi_chengPiYiJian) {
        yijianArr = this.state.dataSource.chuBuHeShi_chengPiYiJian
      }
      const obj = {
        name: window.USER.userName,
        usercode: window.USER.userCode,
        type: '了结理由及情况说明',
        advise: values.chuBuHeShi_chengPiYiJian ? values.chuBuHeShi_chengPiYiJian : '',
        time
      }
      yijianArr.push(obj)
      values.chuBuHeShi_chengPiYiJian = yijianArr
      values.chuBuHeShi_chengPiYiJian = '了结呈批已登记'
      post(
        `thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
        values
      ).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'chuBuHeShi_yuYiLiaoJie_chengBanLingDao'
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
    const { dataSource, leaderList } = this.state
    const leaderListItem = leaderList.map((item, index) => <option value={item.userCode}>{item.userName}</option>)
    return (
      <div className={style.content} style={{ paddingLeft: '20%' }}>
        <p className={style.title} style={{ paddingLeft: '16%' }}>
          内蒙古自治区纪委监委驻自治区农信联社纪检监察组
        </p>
        <p className={style.title} style={{ paddingLeft: '28%' }}>
          了结呈批表
        </p>
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
              {this.state.leaderOption && (
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
              )}
            </tbody>
          </table>
          <p style={{ marginTop: 10 }}>上传附件：</p>
          <Button type='link' size='large'>
            《谈话函询情况报告》
          </Button>
          {this.type === 'add' && (
            <div className={style.title}>
              <TableInput>
                <Form.Item label='了结理由及情况说明：' style={{ display: 'flex' }}>
                  {getFieldDecorator('tanHuaHanXun_niBanYiJian', {
                    rules: [{ required: true, message: '必填!' }]
                  })(<Input.TextArea size='large' allowClear rows={8} style={{ width: 870 }} />)}
                </Form.Item>
              </TableInput>
            </div>
          )}
        </Form>
        <div>
          {this.state.leaderList.length > 0 && (
            <div style={{ display: 'flex' }}>
              <span>批办领导：</span>
              <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                {leaderListItem}
              </Select>
            </div>
          )}
        </div>
        <div style={{ marginLeft: 750 }}>
          <Button size='large'>返回</Button>
          {this.type === 'add' && (
            <Button type='primary' size='large' className={style.submitBtn} onClick={this.submit} style={{ marginLeft: 10 }}>
              提交
            </Button>
          )}
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(LiaoJieChengPi)
export default wapper
