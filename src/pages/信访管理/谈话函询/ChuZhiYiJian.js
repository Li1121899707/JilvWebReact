/*
 * @author: bifan
 * @Datetime  2020/2/19 15:15
 */
import React, { Component } from 'react'
import { Button, Form, Input, Select, notification, Divider, DatePicker, Tabs, Timeline } from 'antd'
import { Link, router } from 'umi'
import moment from 'moment'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'
import DefaultTemplate from '@/pages/信访管理/common/DefaultTemplate'

const { Option } = Select
const { TabPane } = Tabs

class ChengPi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
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
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
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
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '填写处置意见') {
      notification.error({ message: '该处置意见已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.tanHuaHanXun_status = '已提交处置意见'
        const yijianArr = []
        let tanHuaArr = []
        let filesArr = []
        if (this.state.dataSource.tanHuaHanXun_yiJian) {
          tanHuaArr = this.state.dataSource.tanHuaHanXun_yiJian
        }
        if (this.state.dataSource.tanHuaHanXun_files) {
          filesArr = this.state.dataSource.tanHuaHanXun_files
        }

        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '处置意见',
          advise: values.tanHuaHanXun_niBanYiJian ? values.tanHuaHanXun_niBanYiJian : '',
          time,
          link: `/admin/petition/talk/show/${processInstanceId}/chuZhiYiJianShenPi`,
          leaderType: '登记人'
        }
        yijianArr.push(obj)
        filesArr[tanHuaArr.length - 1].tanHuaHanXun_chuZhiYiJianChengPi_files = this.fileRef.state.fileList
        tanHuaArr[tanHuaArr.length - 1].tanHuaHanXun_chuZhiYiJianChengPi = yijianArr
        values.tanHuaHanXun_yiJian = tanHuaArr
        values.tanHuaHanXun_files = filesArr
        if (err) return false
        // console.log(values)
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
    let taskId = 'tanHuaHanXun_tianXieYiJian_jiJianJianChaShi'
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
    const { dataSource, leaderList, leaderOption_wenTiXianSUO, leaderOption_tanHuaHanXun } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))

    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>谈话函询处置意见</p>
          <Form>
            <table className={styles.table}>
              <tbody>
               <DefaultTemplate dataSource={dataSource}/>
                <tr>
                  <td className={styles.label}>案件名称</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add' data={dataSource.tanHuaHanXun_anJianMingCheng}>
                      <Form.Item>
                        {getFieldDecorator('tanHuaHanXun_anJianMingCheng', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input placeholder='' size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>拟办/审批意见</td>
                  <td className={styles.val} colSpan={7}>
                    <Tabs defaultActiveKey='1' type='card' style={{ textAlign: 'left' }}>
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
                              <div className={styles.bold}>{item.type}：</div>
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
                                        <div className={styles.bold}>{itemList.type}：</div>
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
                                            <div className={styles.bold}>{itemList.type}：</div>
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
                  <td className={styles.label}>处置意见</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add'>
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
                  fileList={dataSource.tanHuaHanXun_chuZhiYiJian_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
            <div>
              <TableInput data={dataSource.tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi}>
                <Form.Item style={{ marginTop: 20, display: 'flex' }} label='后续处置方式：'>
                  {getFieldDecorator('tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Select allowClear style={{ width: 200 }}>
                      <Option value='了结澄清'>了结澄清</Option>
                      <Option value='谈话提醒'>谈话提醒</Option>
                      <Option value='批评教育'>批评教育</Option>
                      <Option value='责令检查'>责令检查</Option>
                      <Option value='诫勉谈话'>诫勉谈话</Option>
                      <Option value='再次谈话函询'>再次谈话函询</Option>
                      <Option value='转初步核实'>转初步核实</Option>
                    </Select>
                  )}
                </Form.Item>
              </TableInput>
            </div>
          </Form>

          <div>
            <div style={{ display: 'flex' }}>
              <span>批办领导：</span>
              <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                {leaderListItem}
              </Select>
            </div>
          </div>
          <div className={styles.submitDiv} style={{ textAlign: 'center' }}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                取消
              </Button>
              <Button type='primary' className={styles.submitBtn} onClick={this.submit}>
                确定
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
