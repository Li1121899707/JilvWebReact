/**
 * @Author 王舒宁
 * @Date 2020/3/19 9:56
 **/

import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Icon, Popconfirm, notification } from 'antd'
import moment from 'moment'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'

const { Option } = Select

class LogList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: []
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = {}) => {
    let fidldsValue = {}
    this.props.form.validateFields((err, values) => {
      fidldsValue = {
        ...values,
        startTime: values.startTime ? dateToUTC(values.startTime) : '',
        endTime: values.endTime ? dateToUTC(values.endTime) : ''
      }
    })
    this.setState({ loading: true })
    const newParams = { page: 0, size: this.PageSize, ...fidldsValue, ...params }
    get('login-related-logs', newParams).then(res => {
      const { pagination } = this.state
      if (Object.keys(params).length === 0 && pagination.current !== 0) {
        pagination.current = 0
      }
      pagination.total = parseInt(res.headers['x-total-count'], 10)
      this.setState({
        dataSource: res.data,
        loading: false,
        pagination
      })
    })
  }

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
        title: '账号',
        align: 'center',
        dataIndex: 'loginCode',
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
        title: '姓名',
        align: 'center',
        dataIndex: 'userName',
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
        title: '角色',
        align: 'center',
        dataIndex: 'userRole',
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
        title: '时间',
        dataIndex: 'operateTime',
        align: 'center',
        render: text => {
          return moment(text).format('YYYY-MM-DD hh:mm:ss')
        }
      },
      {
        title: '操作',
        dataIndex: 'operateType',
        align: 'center',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
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
                        <Form.Item label='关键字'>
                          {getFieldDecorator('vague', {
                            getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(<Input disabled={this.state.disable} onChange={this.onChange} allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='时间起'>
                          {getFieldDecorator('startTime', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='时间止'>
                          {getFieldDecorator('endTime', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Button type='primary' onClick={() => this.fetch()}>
                          搜索
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Form>

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
export default Form.create()(LogList)
