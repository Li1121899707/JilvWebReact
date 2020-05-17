import React, { Component } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, Tabs, Timeline } from 'antd'
import { Link, router } from 'umi'
import moment from 'moment'
import { get, post } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import style from '@/pages/信访管理/Index.less'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'

// const { Option } = Select
const { TabPane } = Tabs

class ChengPi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      data: {}
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
        data: res.data,
        leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
        leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
      })
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let time = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    const processInstanceId = data.processInstanceId
    if (taskName !== '填写谈话函询呈批表') {
      notification.error({ message: '该呈批表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.tanHuaHanXun_status = '已登记'
        values.tanHuaHanXun_RiQi = new Date()
        if (err) return false
        const yijianArr = []
        let filesArr = []
        let tanHuaArr = []
        if (this.state.dataSource.tanHuaHanXun_yiJian) {
          tanHuaArr = this.state.dataSource.tanHuaHanXun_yiJian
        }
        if (this.state.dataSource.tanHuaHanXun_files) {
          filesArr = this.state.dataSource.tanHuaHanXun_files
        }
        const arrObj = {}
        const fileObj = {}
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '拟办意见',
          advise: values.tanHuaHanXun_niBanYiJian ? values.tanHuaHanXun_niBanYiJian : '',
          time,
          link: `/admin/petition/talk/show/${processInstanceId}/ShenPiChengPi`,
          leaderType: '登记人'
        }
        fileObj.tanHuaHanXun_chengPi_files = this.fileRef.state.fileList
        yijianArr.push(obj)
        arrObj.tanHuaHanXun_chengPi = yijianArr
        filesArr.push(fileObj)
        tanHuaArr.push(arrObj)
        values.tanHuaHanXun_yiJian = tanHuaArr
        values.wenTiXianSuo_status = '谈话函询中'
        values.tanHuaHanXun_files = filesArr
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

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = 'tanHuaHanXun_jiJianJianChaShi'
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  group = (array, subGroupLength) => {
    let index = 0
    let newArray = []
    while (index < array.length) {
      newArray.push(array.slice(index, (index += subGroupLength)))
    }
    return newArray
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const { dataSource, leaderOption_wenTiXianSUO, leaderOption_chuBuHeShi, leaderOption_tanHuaHanXun } = this.state
    const leaderListItem = this.state.leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))

    return (
      <div className={style.content}>
        <div className={style.content_box_LiAn}>
          <p className={style.title}>中共内蒙古自治区农村信用社联合社纪律检查委员会</p>
          <p className={style.title}>谈话函询呈批表</p>
          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>谈话函询对象</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>性别</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={style.label}>年龄</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenNianLing} />
                  </td>
                  <td className={style.label}>政治面貌</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={style.label}>民族</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>线索来源</td>
                  <td className={style.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反应的主要问题摘要</td>
                  <td className={style.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>拟办/审批意见</td>
                  <td className={style.val} colSpan={7}>
                    <Tabs defaultActiveKey='3' type='card' style={{ textAlign: 'left' }}>
                      <TabPane tab='问题线索' key='1'>
                        <Timeline mode='left'>
                          {leaderOption_wenTiXianSUO.map((item, index) => (
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
                      </TabPane>
                      {leaderOption_tanHuaHanXun.length > 0 ? (
                        <TabPane tab='谈话函询' key='2'>
                          <Tabs>
                            {leaderOption_tanHuaHanXun.map((item, index) => {
                              return (
                                <TabPane key={index} tab={`第${index + 1}次谈话函询`}>
                                  {item.tanHuaHanXun_chengPi.map((itemList, i) => {
                                    return (
                                      <Timeline.Item key={i} style={{ textAlign: 'left' }}>
                                        <div>
                                          {itemList.name} {itemList.time}{' '}
                                          {itemList.link && (
                                            <Link to={itemList.link} target='_blank'>
                                              详情
                                            </Link>
                                          )}
                                        </div>
                                        <div className={style.bold}>{itemList.type}：</div>
                                        <div>{itemList.advise}</div>
                                      </Timeline.Item>
                                    )
                                  })}
                                  {item.tanHuaHanXun_chuZhiYiJianChengPi
                                    ? item.tanHuaHanXun_chuZhiYiJianChengPi.map((itemList, i) => {
                                        return (
                                          <Timeline.Item key={i} style={{ textAlign: 'left' }}>
                                            <div>
                                              {itemList.name} {itemList.time}{' '}
                                              {itemList.link && (
                                                <Link to={itemList.link} target='_blank'>
                                                  详情
                                                </Link>
                                              )}
                                            </div>
                                            <div className={style.bold}>{itemList.type}：</div>
                                            <div>{itemList.advise}</div>
                                          </Timeline.Item>
                                        )
                                      })
                                    : null}
                                </TabPane>
                              )
                            })}
                          </Tabs>
                        </TabPane>
                      ) : null}
                    </Tabs>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>拟办意见</td>
                  <td className={style.val} colSpan={7}>
                    <TableInput propsMode='add' data={dataSource.tanHuaHanXun_niBanYiJian}>
                      <Form.Item>
                        {getFieldDecorator('tanHuaHanXun_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' rows={8} allowClear />)}
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
                  fileList={dataSource.tanHuaHanXun_chengPi_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
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
          <div className={style.submitDiv} style={{ textAlign: 'center' }}>
            <div className={style.submitDiv}>
              <Button className={style.submitBtn} onClick={() => router.goBack()}>
                返回
              </Button>
              <Button type='primary' className={style.submitBtn} onClick={this.submit}>
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(ChengPi)
export default wapper
