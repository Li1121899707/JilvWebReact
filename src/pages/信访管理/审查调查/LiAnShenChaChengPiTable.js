// 组织机构下拉树
import React, { Component } from 'react'
import { Form, Select, Input, DatePicker, Button, notification, Tabs, Timeline } from 'antd'
import moment from 'moment'
import { Link, router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '../common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'

const { Option } = Select
const { TabPane } = Tabs

class LiAnShenChaChengPiTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: {},
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: []
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      if (res.data.form.chuBuHeShi_chuHeBaoGaoChengPi) {
        res.data.form.chuBuHeShi_chuBuHeShiChengPi.push(...res.data.form.chuBuHeShi_chuHeBaoGaoChengPi)
      }
      const leaderOption_chuBuHeShi = res.data.form.chuBuHeShi_chuBuHeShiChengPi

      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          leaderOption_chuBuHeShi,
          leaderOption_shenChaDiaoCha: res.data.form.shenChaDiaoCha_niBanYiJian ? res.data.form.shenChaDiaoCha_niBanYiJian : []
        },
        this.huoquhouxunaren
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
    if (taskName !== '填写立案审查呈批表') {
      notification.error({ message: '该呈批表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.shenChaDiaoCha_status = '已登记'
        values.shenChaDiaoCha_RiQi = new Date()
        if (err) return false
        let yijianArr = []
        // if (this.state.dataSource.shenChaDiaoCha_niBanYiJian) {
        //   yijianArr = this.state.dataSource.shenChaDiaoCha_niBanYiJian
        // }
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '承办部门意见',
          advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
          time,
          leaderType: '登记人',
          link: `/admin/petition/investigation/show/${processInstanceId}/liAnShenChaChengShenPi`
        }
        yijianArr.push(obj)
        values.shenChaDiaoCha_ChengPi = yijianArr
        values.wenTiXianSuo_status = '立案审查中'
        values.shenChaDiaoCha_ChengPi_files = this.fileRef.state.fileList
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
    let taskId = 'LiAnShenCha_jiJianJianChaShi'
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
    const {
      leaderList,
      dataSource,
      leaderOption_wenTiXianSUO,
      leaderOption_chuBuHeShi,
      leaderOption_tanHuaHanXun,
      leaderOption_shenChaDiaoCha
    } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>
            内蒙古自治区纪委监委驻自治区农信联社纪检监察组
            <br />
            立案审查呈批表
          </p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>被审(调查)人姓名/单位/事件/事故</td>
                  <td className={styles.val} colSpan={7}>
                    {dataSource.wenTiXianSuo_beiFanYingRen}/{dataSource.wenTiXianSuo_beiFanYingRenDanWei}/{dataSource.shenChaDiaoCha_weiJiWenTi}/
                    {dataSource.wenTiXianSuo_beiFanShiGu}
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label}>民族</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                  <td className={styles.label}>学历</td>
                  <td className={styles.val}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_beiFanYingRenXueLi}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenXueLi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>出生年月</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_beiFanYingRenBorn ? moment(dataSource.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>入党时间</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位及职务(包括兼职)</td>
                  <td className={styles.val} colSpan={7}>
                    {dataSource.wenTiXianSuo_beiFanYingRenDanWei}/{dataSource.wenTiXianSuo_beiFanYingRenZhiWu}
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>职级</td>
                  <td className={styles.val}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_beiFanYingRenZhiJi}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenZhiJi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={styles.label}>问题线索来源</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>证件类型</td>
                  <td className={styles.val}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_beiFanYingRenZhengJianLeiXing}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenZhengJianLeiXing', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>证件号码</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_beiFanYingRenZhengJianLeiXing}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenZhengJianHaoMa', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input style={{ width: 320 }} allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={styles.label}>是否国家监察对象</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_isGuoJiaJianCha}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_isGuoJiaJianCha', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: 320 }}>
                            <Option value='是'>是</Option>
                            <Option value='否'>否</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>一把手违纪违法</td>
                  <td className={styles.val} colSpan={5}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_yiBaShou}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_yiBaShou', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: 800 }}>
                            <Option value='否'>否</Option>
                            <Option value='查处时任一把手'>查处时任一把手</Option>
                            <Option value='违纪违法时任一把手'>违纪违法时任一把手</Option>
                            <Option value='查处时违纪时均任一把手'>查处时违纪时均任一把手</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td>是否党代表(何级)</td>
                  <td>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_isDangDaiBiao}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_isDangDaiBiao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={styles.label}>是否人大代表(何级)</td>
                  <td className={styles.val}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_isRenDaDaiBiao}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_isRenDaDaiBiao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={styles.label}>是否政协委员(何级)</td>
                  <td className={styles.val}>
                    <TableInput propsMode={this.type} data={dataSource.wenTiXianSuo_isZhengXieWeiYuan}>
                      <Form.Item style={{ display: 'flex' }}>
                        {getFieldDecorator('wenTiXianSuo_isZhengXieWeiYuan', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>主要违纪问题</td>
                  <td className={styles.val} colSpan={5}>
                    <TableInput data={dataSource.shenChaDiaoCha_weiJiWenTi}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_weiJiWenTi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input size='large' />)}
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
                                {item.name} {item.time}
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
                                  {item.name} {item.time}
                                </div>
                                <div className={styles.bold}>{item.type}：</div>
                                <div>{item.advise}</div>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </TabPane>
                      ) : null}

                      {leaderOption_shenChaDiaoCha.length > 0 ? (
                        <TabPane tab='审查调查' key='4'>
                          <Timeline mode='left'>
                            {leaderOption_shenChaDiaoCha.map((item, index) => (
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
                <tr>
                  <td className={styles.label}>承办部门意见</td>
                  <td className={styles.val} colSpan={5}>
                    <TableInput data={dataSource.shenChaDiaoCha_niBanYiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_niBanYiJian')(
                          <Input.TextArea
                            placeholder='经核实，XXX问题涉嫌违纪，依据《中国共产党纪律检查机关监督执纪工作规则》第三十七条的规定，建议对XXX同志的违纪问题进行立案审查。请领导审阅。'
                            size='large'
                            rows={8}
                            allowClear
                            style={{ width: 900 }}
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
                  fileList={dataSource.shenChaDiaoCha_ChengPi_files || []}
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

const wapper = Form.create()(LiAnShenChaChengPiTable)
export default wapper
