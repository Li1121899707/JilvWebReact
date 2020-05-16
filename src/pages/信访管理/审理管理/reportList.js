/**
 * @Author 王舒宁
 * @Date 2020/3/2 19:49
 **/

import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Icon, Popconfirm, notification } from 'antd'
import moment from 'moment'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'
import { router } from 'umi'

const { Option } = Select

class reportList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: [
        {
          num: '00001',
          perNum: '10008',
          beiName: '张三',
          unit: '金谷农商银行',
          zhiWu: '主任',
          startDate: '2019.05.12',
          chuZhi: '初步核实',
          Date: '2019.05.20',
          laiYuan: '信访举报',
          fanyingName: '陈某',
          state: '未提交'
        },
        {
          num: '00002',
          perNum: '10009',
          beiName: '李四',
          unit: '金谷农商银行',
          zhiWu: '主任',
          startDate: '2019.05.12',
          chuZhi: '初步核实',
          Date: '2019.05.20',
          laiYuan: '信访举报',
          fanyingName: '陈某',
          state: '已提交'
        }
      ]
    }
    this.clueSource = [
      '全部',
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
    this.mode = this.props.match.params.type
  }

  componentDidMount() {
    //this.fetch()
  }

  // fetch = (params = {}) => {
  //   let fidldsValue = {}
  //   this.props.form.validateFields((err, values) => {
  //     fidldsValue = {
  //       ...values,
  //       startTime: values.startTime ? dateToUTC(values.startTime) : '',
  //       endTime: values.endTime ? dateToUTC(values.endTime) : ''
  //     }
  //   })
  //   this.setState({ loading: true })
  //   const newParams = { page: 0, size: this.PageSize, ...fidldsValue, ...params }
  //   get('operate-logs', newParams).then(res => {
  //     const { pagination } = this.state
  //     if (Object.keys(params).length === 0 && pagination.current !== 0) {
  //       pagination.current = 0
  //     }
  //     pagination.total = parseInt(res.headers['x-total-count'], 10)
  //     this.setState({
  //       dataSource: res.data,
  //       loading: false,
  //       pagination
  //     })
  //   })
  // }

  handleTableChange = (pagination, filters) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current - 1
    this.setState({ pagination })
    this.fetch({
      page: pager.current,
      ...filters
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const defaultValue = JSON.parse(sessionStorage.getItem(''))
    const columns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'no',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: '线索编号',
        align: 'center',
        dataIndex: 'num',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '案件名称',
        align: 'center',
        dataIndex: 'perNum',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '被反映人',
        align: 'center',
        dataIndex: 'beiName',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '工作单位',
        align: 'center',
        dataIndex: 'unit',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '职务',
        align: 'center',
        dataIndex: 'zhiWu',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '审理日期',
        dataIndex: 'startDate',
        align: 'center'
        // render: text => {
        //   return moment(text).format('YYYY-MM-DD')
        // }
      },
      {
        title: '处置方法',
        align: 'center',
        dataIndex: 'chuZhi',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '呈批日期',
        dataIndex: 'Date',
        align: 'center'
        // render: text => {
        //   return moment(text).format('YYYY-MM-DD')
        // }
      },
      {
        title: '线索来源',
        align: 'center',
        dataIndex: 'laiYuan',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '反映人',
        align: 'center',
        dataIndex: 'fanyingName',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '办理状态',
        align: 'center',
        dataIndex: 'state',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operate',
        render: (text, record) => {
          if (record.state === '已呈批') {
            return (
              <div>
                <Button type='link' size='small'>
                  查看
                </Button>
              </div>
            )
          } else if (record.state === '未提交') {
            return (
              <div>
                <Button
                  type='link'
                  size='small'
                  onClick={() => {
                    router.push('/admin/petition/management/add/1/ShenLiBaoGao')
                  }}
                >
                  填写审理报告呈批表
                </Button>
                <Button type='link' size='small'>
                  查看
                </Button>
              </div>
            )
          } else if (record.state === '已提交') {
            return (
              <div>
                <Button type='link' size='small'>
                  查看
                </Button>
                <Button
                  type='link'
                  size='small'
                  onClick={() => {
                    router.push('/admin/petition/management/add/1/ShenYueShenLiBaoGao')
                  }}
                >
                  审阅
                </Button>
              </div>
            )
          }
        }
      }
    ]
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 }
    }
    return (
      <div>
        <Breadcrumbs />
        <div className='content-box'>
          <Form {...formItemLayout}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={22}>
                <table className='query-condition-tb'>
                  <tbody style={{ textAlign: 'right' }}>
                    <tr>
                      <td>
                        <Form.Item label='审理日期起'>
                          {getFieldDecorator('shenLiGuanLi_shenLiBaoGao_shenLiRiQi>', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='审理日期止'>
                          {getFieldDecorator('shenLiGuanLi_shenLiBaoGao_shenLiRiQi<', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='办理状态'>
                          {getFieldDecorator('shenLiGuanLi_shenLiBaoGao_banLiZhuangTai=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              <Option value='全部'>全部</Option>
                              <Option value='未提交'>未提交</Option>
                              <Option value='已提交'>已提交</Option>
                              <Option value='已呈批'>已呈批</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='线索来源'>
                          {getFieldDecorator('shenLiGuanLi_shenLiBaoGao_xianSuoLaiYuan=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.clueSource.map(item => {
                                return <Option value={item}>{item}</Option>
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='被反映人'>
                          {getFieldDecorator('shenLiGuanLi_shenLiBaoGao_beiFanYingRen~', {
                            getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(<Input disabled={this.state.disable} onChange={this.onChange} allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='反映人'>
                          {getFieldDecorator('shenLiGuanLi_shenLiBaoGao_fanYingRen~', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Button type='primary' onClick={() => this.fetch()} style={{ marginLeft: 10 }}>
                          查询
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Form>
          <Divider />
          <Button style={{ marginRight: 20 }} type='primary'>
            导出
          </Button>
          <div>
            <Table
              rowKey={record => record.id}
              dataSource={this.state.dataSource}
              columns={columns}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default Form.create()(reportList)
