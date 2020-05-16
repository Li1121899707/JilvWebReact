/*
 * @author: 王志鹏
 * @Datetime  2020/2/19 15:23
 */

import React, { Component } from 'react'
import { Form, Input, Select, DatePicker, Upload, Button, notification, Timeline, Tabs } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import style from '../Index.less'
import TableInput from '../common/TableInput'
import { get, post, put } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import styles from '@/pages/信访管理/Index.less'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { concatForArr } from '@/utils/concat'

const { Option } = Select
const { TabPane } = Tabs

class dengJiJieGuoTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leaderList: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      leaderOption_chuBuHeShi: [],
      leaderOption_shenChaDiaoCha: [],
      leaderOption_shenLiGuanLi: [],
      xingTai: ['第一种形态', '第二种形态', '第三种形态', '第四种形态']
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.jieGuoFenLei = ['违纪行为', '职务违法犯罪行为', '申诉', '批评建议', '业务范围外', '无实质内容的信访举报']
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      const leaderOption_shenLiGuanLi = concatForArr(res.data.form, [
        'shenLiGuanLi_tiQianJieRuChengPi',
        'shenLiGuanLi_countYanQiYiJian',
        'shenLiGuanLi_shenLiBaoGaoChengPi'
      ])

      const leaderOption_chuBuHeShi = concatForArr(res.data.form, ['chuBuHeShi_chuBuHeShiChengPi', 'chuBuHeShi_chuHeBaoGaoChengPi'])
      const leaderOption_shenChaDiaoCha = concatForArr(res.data.form, [
        'shenChaDiaoCha_ChengPi',
        'shenChaDiaoCha_fangAnChengPi',
        'shenChaDiaoCha_yanQiWaiCha',
        'shenChaDiaoCha_baoGaoChengPi',
        'shenChaDiaoCha_tiQianJieRu',
        'shenChaDiaoCha_anJianYiSong'
      ])
      res.data.form.wenTiXianSuo_shouDaoShiJian = res.data.form.wenTiXianSuo_shouDaoShiJian
        ? moment(res.data.form.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD')
        : ''

      this.setState({
        dataSource: res.data.form,
        data: res.data,
        leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
        leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : [],
        leaderOption_chuBuHeShi,
        leaderOption_shenChaDiaoCha,
        leaderOption_shenLiGuanLi
      })
    })
  }

  submit = () => {
    const taskid = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId
    const reportNum = this.state.dataSource.wenTiXianSuo_xuHao
    this.props.form.validateFields((err, values) => {
      if (
        values.dengJiJieGuo_chuZhiJieGuo &&
        values.dengJiJieGuo_chuZhiJieGuoFenLei &&
        values.dengJiJieGuo_isDangZhengLeader &&
        values.dengJiJieGuo_siZhongXingTai
      ) {
        values.status = '已办结'
        post(`activiti/completeTask?taskId=${taskid}`, values).then(res => {
          put(`petitions/${reportNum}/resultClass?resultClass=${values.dengJiJieGuo_chuZhiJieGuoFenLei}`).then(result => {
            notification.success({ message: '提交成功' })
            router.goBack()
            this.fetch()
          })
        })
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const {
      dataSource,
      leaderOption_wenTiXianSUO,
      leaderOption_chuBuHeShi,
      leaderOption_shenLiGuanLi,
      leaderOption_tanHuaHanXun,
      leaderOption_shenChaDiaoCha,
      leaderList
    } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={style.title}>问题线索结果登记表</p>
          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>线索来源</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>收件日期</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_shouDaoShiJian} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映人</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRen} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>政治面貌</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_zhengZhiMianMao} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>工作单位</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>工作单位</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映主要问题</td>
                  <td className={style.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>处置过程</td>
                  <td className={style.val} colSpan={3} height={60}>
                    <Tabs defaultActiveKey='1' type='card' style={{ textAlign: 'left' }}>
                      {leaderOption_wenTiXianSUO.length > 0 ? (
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
                      ) : null}

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
                      {leaderOption_shenLiGuanLi.length > 0 ? (
                        <TabPane tab='审理管理' key='5'>
                          <Timeline mode='left'>
                            {leaderOption_shenLiGuanLi.map((item, index) => (
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
                  <td className={style.label}>处置结果</td>
                  <td className={style.val} colSpan={3} height={60}>
                    <TableInput data={dataSource.dengJiJieGuo_chuZhiJieGuo}>
                      <Form.Item>
                        {getFieldDecorator('dengJiJieGuo_chuZhiJieGuo', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>四种形态归类</td>

                  <td className={style.val} colSpan={1}>
                    <TableInput data={dataSource.dengJiJieGuo_siZhongXingTai}>
                      <Form.Item>
                        {getFieldDecorator('dengJiJieGuo_siZhongXingTai', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.state.xingTai.map((item, index) => {
                              return (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              )
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>是否涉及党政领导</td>
                  <td className={style.val} colSpan={1} height={60}>
                    <TableInput data={dataSource.dengJiJieGuo_isDangZhengLeader}>
                      <Form.Item>
                        {getFieldDecorator('dengJiJieGuo_isDangZhengLeader', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select>
                            <Option value='是'>是</Option>
                            <Option value='否'>否</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>处置结果分类</td>
                  <td className={style.val} colSpan={3} height={60}>
                    <TableInput data={dataSource.dengJiJieGuo_chuZhiJieGuoFenLei}>
                      <Form.Item>
                        {getFieldDecorator('dengJiJieGuo_chuZhiJieGuoFenLei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select>
                            {this.jieGuoFenLei.map(item => (
                              <Option value={item}>{item}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
          <div style={{ marginLeft: '10%' }}>
            <Button style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
              返回
            </Button>
            <DisplayControlComponent>
              <Button type='primary' onClick={this.submit}>
                提交保存
              </Button>
            </DisplayControlComponent>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(dengJiJieGuoTable)
export default wapper
