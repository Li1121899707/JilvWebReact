/*
 * @author: bifan
 * @Datetime  2020/2/19 15:15
 */
import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Timeline, Tabs } from 'antd'
import moment from 'moment'
import { Link, router } from 'umi'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import styles from '@/pages/信访管理/Index.less'
import UploadComp from '@/components/upload/Upload'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { concatForArr } from '@/utils/concat'

const { Option } = Select
const { TabPane } = Tabs

class ChuHeBaoGaiChengPi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: []
    }
    this.id = this.props.match.params.id
    this.mode = this.props.match.params.type
    this.leader = ''
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      const leaderOption_chuBuHeShi = concatForArr(res.data.form, ['chuBuHeShi_chuBuHeShiChengPi', 'chuBuHeShi_chuHeBaoGaoChengPi'])
      res.data.form.wenTiXianSuo_beiFanYingRenBorn = res.data.form.wenTiXianSuo_beiFanYingRenBorn
        ? moment(res.data.form.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD')
        : null
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          leaderOption_chuBuHeShi
        },
        this.huoquhouxunaren
      )
    })
  }

  submit = () => {
    const { data } = this.state
    const taskid = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const processInstanceId = data.processInstanceId
    const taskName = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1].taskName
    if (taskName !== '填写初步核实报告呈批表') {
      notification.error({ message: '该处置意见已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        if (err) return false
        const { taskDefinitionKey } = data.historicUserTaskInstanceList[data.historicUserTaskInstanceList.length - 1]
        if (taskDefinitionKey === 'chuBuHeShi_baoGaochengpi') {
          values.chuBuHeShi_status = '已登记初核报告'
        } else if (taskDefinitionKey === 'chuBuHeShiBaoGao_dangWeiShuJi') {
          values.chuBuHeShi_status = '初核报告已审批'
        } else {
          values.chuBuHeShi_status = '初核报告审批中'
        }

        values.chuBuHeShi_chuHeBaoGaoChengPi = [
          {
            name: window.USER.userName,
            usercode: window.USER.userCode,
            type: '核实基本情况',
            advise: values.chuBuHeShi_baoGao_heShiJiBenQingKuang,
            time: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            link: `/admin/petition/check/show/${processInstanceId}/ShenPiChuHeBaoGaoChengPi`,
            leaderType: '登记人'
          }
        ]
        values.chuBuHeShi_chuHeBaoGaoChengPi_files = this.fileRef.state.fileList
        post(`thread/claimAndComplete?taskId=${taskid}&processInstanceId=${processInstanceId}&nextAssignee=${this.leader}&isLocal=${0}`, values).then(
          res => {
            notification.success({ message: '提交成功' })
            router.goBack()
          }
        )
      })
    }
  }

  //获取下一任务候选人接口
  huoquhouxunaren = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let taskId = null
    const { taskDefinitionKey } = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1]
    if (taskDefinitionKey === 'chuBuHeShi_baoGaoChengPi') {
      taskId = 'chuBuHeShiBaoGao_jiJianJianChaShi'
    }
    if (!taskId) return
    get(`activiti/process/${processDefinitionKey}/tasks/${taskId}/candidateUsers`).then(res => {
      this.setState({
        leaderList: res.data
      })
    })
  }

  selectChange = val => {
    this.leader = val
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

    return (
      <div className={styles.content}>
        <div className={styles.content_box_LiAn}>
          <p className={styles.title}>中共内蒙古自治区农村信用社联合社纪律检查委员会</p>
          <p className={styles.title}>初步核实报告呈批表</p>
          <Form>
            <table className={styles.table} style={{ width: 950 }}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} height={48} width={250} colSpan={6}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被核查人</td>
                  <td className={styles.val} height={48} width={250}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={styles.label} style={{ width: 100 }}>
                    性别
                  </td>
                  <td className={styles.val} height={48} width={150}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label} colSpan={2}>
                    出生年月
                  </td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenBorn} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val} height={48} width={100}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={styles.label} colSpan={2}>
                    是否人大代表/政协委员
                  </td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao} />
                  </td>
                  <td className={styles.label} style={{ width: 100 }}>
                    民族
                  </td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>反应的主要问题摘要</td>
                  <td className={styles.val} height={200} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
                  </td>
                </tr>
                {leaderOption_chuBuHeShi && (
                  <tr>
                    <td className={styles.label}>拟办/审批意见</td>
                    <td className={styles.val} colSpan={7}>
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
                        {leaderOption_chuBuHeShi.length > 0 ? (
                          <TabPane tab='初步核实' key='3'>
                            <Timeline mode='left'>
                              {leaderOption_chuBuHeShi.map((item, index) => (
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
                        ) : null}
                      </Tabs>
                    </td>
                  </tr>
                )}
                <tr>
                  <td className={styles.label}>核实基本情况</td>
                  <td className={styles.val} height={200} colSpan={7}>
                    <TableInput propsMode='add'>
                      <Form.Item>
                        {getFieldDecorator('chuBuHeShi_baoGao_heShiJiBenQingKuang', {
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
                  fileList={dataSource.chuBuHeShi_chuHeBaoGao_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
            <div style={{ marginTop: 10, marginBottom: 10 }}>
              <Form.Item label='后续处置方式：' style={{ display: 'flex' }}>
                {getFieldDecorator('chuBuHeShi_baoGao_houXuChuZhiFangShi', {
                  rules: [{ required: true, message: '必填!' }]
                })(
                  <Select style={{ width: 161, marginRight: 50 }}>
                    <Option value='予以了结'>予以了结</Option>
                    <Option value='拟立案审查'>拟立案审查</Option>
                    <Option value='移交有关党组织处理'>移交有关党组织处理</Option>
                    <Option value='谈话提醒'>谈话提醒</Option>
                  </Select>
                )}
              </Form.Item>
              {this.state.leaderList.length > 0 && (
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <Form.Item style={{ display: 'flex' }} label='批办领导'>
                    {getFieldDecorator('wenTiXianSuo_shenPiLingDao', {
                      rules: [{ required: true, message: '必填!' }]
                    })(
                      <Select style={{ width: 200 }} allowClear onChange={this.selectChange}>
                        {this.state.leaderList.map((item, index) => (
                          <Option key={index} value={item.userCode}>
                            {item.userName}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </div>
              )}
            </div>
          </Form>
          <div className={styles.submitDiv} style={{ textAlign: 'center' }}>
            <Button
              className={styles.submitBtn}
              onClick={() => {
                router.goBack()
              }}
            >
              返回
            </Button>
            <Button type='primary' className={styles.submitBtn} onClick={this.submit}>
              提交
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(ChuHeBaoGaiChengPi)
export default wapper
