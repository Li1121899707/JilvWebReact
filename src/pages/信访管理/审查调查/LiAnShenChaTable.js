import React, { Component } from 'react'
import { Button, Upload, Form, Input, Select, notification, Tabs, Timeline } from 'antd'
import moment from 'moment'
import { Link, router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'
import { concatForArr } from '@/utils/concat'

const { Option } = Select
const { TabPane } = Tabs

class LiAnShenChaTable extends Component {
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
      const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, ['shenChaDiaoCha_ChengPi'])

      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
          leaderOption_chuBuHeShi,
          leaderOption_shenChaDiaoCha
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
    if (taskName !== '填写立案审查方案呈批表') {
      notification.error({ message: '该呈批表已填写' })
    } else {
      this.props.form.validateFields((err, values) => {
        values.shenChaDiaoCha_status = '立案审查方案已登记'
        if (err) return false
        let yijianArr = []
        // if (this.state.dataSource.shenChaDiaoCha_niBanYiJian) {
        //   yijianArr = this.state.dataSource.shenChaDiaoCha_niBanYiJian
        // }
        const obj = {
          name: window.USER.userName,
          usercode: window.USER.userCode,
          type: '承办室意见',
          advise: values.shenChaDiaoCha_niBanYiJian ? values.shenChaDiaoCha_niBanYiJian : '',
          time,
          link: `/admin/petition/investigation/show/${processInstanceId}/lianshenchashenpi`,
          leaderType: '登记人'
        }
        yijianArr.push(obj)
        values.shenChaDiaoCha_fangAnChengPi = yijianArr
        values.shenChaDiaoCha_fangAnChengPi_files = this.fileRef.state.fileList
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
    let taskId = 'LiAnShenCha_fangAn_jiJianJianChaShi'
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
        <div className={styles.content_box_LiAn}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>立案审查方案呈批表</p>
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
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_shenChaFangAn_wenTi}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_shenChaFangAn_wenTi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' allowClear />)}
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
                  <td className={styles.label}>承办室意见：</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='add' data={dataSource.shenChaDiaoCha_niBanYiJian}>
                      <Form.Item>
                        {getFieldDecorator('shenChaDiaoCha_niBanYiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Input.TextArea
                            size='large'
                            placeholder='xx年x月x日内蒙古自治区农信社联合社纪委对xxx立案审查，现已拟定了立案审查方案，请领导审阅。'
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
                  fileList={dataSource.shenChaDiaoCha_fangAnChengPi_files || []}
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
            <Button type='primary' onClick={this.submit}>
              提交保存
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(LiAnShenChaTable)
export default wapper
