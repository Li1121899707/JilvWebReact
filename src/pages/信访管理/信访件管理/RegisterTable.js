import React, { Component } from 'react'
import { router } from 'umi'
import { Button, DatePicker, Form, Input, Select, Upload, notification } from 'antd'
import moment from 'moment'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import UploadComp from '@/components/upload/Upload'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import { exportFiles } from '@/utils/common'

const { Option } = Select

class RegisterTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {}
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.letterSource = [`自治区纪委监委转`, '内蒙古银保监局转', '自治区联社领导转', '盟市纪委监委转', '公众号', '举报信箱', '其他']
    this.fanYingRen = ['自治区联社机关干部', '基层行社一把手', '基层行社其他班子成员', '基层行社环节干部', '基层行社其他人员', '单位']
    this.laiXin = [
      '呼和浩特市',
      '赤峰市',
      '呼伦贝尔市',
      '兴安盟',
      '通辽市',
      '乌兰察布市',
      '锡林郭勒盟',
      '包头市',
      '巴彦淖尔市',
      '阿拉善盟',
      '鄂尔多斯市',
      '乌海市'
    ]
    this.contextType = [
      `违规发放贷款以贷谋私`,
      '违规招录和提拔人员',
      '经商办企业',
      '违规基建',
      '违规装修房屋',
      '大宗物品采购',
      '工作作风问题',
      '诉求类',
      '其他违反八项规定精神的问题'
    ]
  }

  componentDidMount() {
    if (this.type === 'show') {
      this.fetch()
    }
  }

  fetch = () => {
    get(`petitions/${this.id}`).then(res => {
      res.data.attachment = JSON.parse(res.data.attachment)
      this.props.form.setFieldsValue(res.data)
      this.setState({
        dataSource: res.data
      })
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    this.props.form.validateFields((err, values) => {
      // values.wenTiXianSuo_dengJiTime = new Date()
      // values.wenTiXianSuo_status = '未登记'
      // values.status = '问题线索'
      values.attachment = JSON.stringify(this.fileRef.state.fileList)
      if (err) return false
      // 开始流程接口
      post(`petitions`, { ...values }).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { dataSource } = this.state
    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>中共内蒙古自治区农村信用社联合社检查委员会</p>
          <p className={style.title}>信访件登记表</p>
          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>信访件来源</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.source}>
                      <Form.Item>
                        {getFieldDecorator('source', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.letterSource.map((item, index) => {
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
                </tr>

                <tr>
                  <td className={style.label}>反映人</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.reporter}>
                      <Form.Item>
                        {getFieldDecorator('reporter', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.reporterUnit}>
                      <Form.Item>
                        {getFieldDecorator('reporterUnit', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.reporterPost}>
                      <Form.Item>
                        {getFieldDecorator('reporterPost', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.informee}>
                      <Form.Item>
                        {getFieldDecorator('informee', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.informeeUnit}>
                      <Form.Item>
                        {getFieldDecorator('informeeUnit', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.informeePost}>
                      <Form.Item>
                        {getFieldDecorator('informeePost', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人分类</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.informeeClass}>
                      <Form.Item>
                        {getFieldDecorator('informeeClass', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.fanYingRen.map((item, index) => {
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
                </tr>
                <tr>
                  <td className={style.label}>反映问题类型</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.contentClass}>
                      <Form.Item>
                        {getFieldDecorator('contentClass', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.contextType.map((item, index) => {
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
                </tr>

                <tr>
                  <td className={style.label}>信访件来源（地区）</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.sourceCity}>
                      <Form.Item>
                        {getFieldDecorator('sourceCity', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.laiXin.map((item, index) => {
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
                </tr>
                <tr>
                  <td className={style.label}>收到时间</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.recieveTime ? moment(dataSource.recieveTime).format('YYYY-MM-DD') : ''}>
                      <Form.Item>
                        {getFieldDecorator('recieveTime', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>内容摘要</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.content}>
                      <Form.Item>
                        {getFieldDecorator('content', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
            {this.type === 'add' ? (
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            ) : (
              <p style={{ textAlign: 'left' }}>
                相关附件:
                {dataSource.attachment &&
                  dataSource.attachment.map(item => (
                    <a target='_blank' href={
                      exportFiles(`${window.server}/api/files/${item.response.path}`, item.response.path)
                      }>
                      {item.response.fileName}&emsp;
                    </a>
                  ))}
              </p>
            )}
          </Form>
          <Button style={{ marginRight: 20 }} onClick={() => router.goBack()}>
            返回
          </Button>
          {this.type !== 'show' && (
            <Button type='primary' onClick={this.submit}>
              提交保存
            </Button>
          )}
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(RegisterTable)
export default wapper
