/**
 * @Author 王舒宁
 * @Date 2020/3/24 19:55
 **/

import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Popconfirm, Icon, notification, Modal } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import { del, get, put, post } from '@/utils/http'
import { dateToUTC } from '@/utils/common'
import UploadForFiles from '@/components/upload/uploadForFiles'

const { Option } = Select

class List extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      addModal: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: []
    }
    this.name = ''
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = {}) => {
    let fidldsValue = {}
    this.props.form.validateFields((err, values) => {
      values.createTimeEnd = moment(values.createTimeEnd).add(1, 'd')
      fidldsValue = {
        ...values,
        createTimeStart: values.createTimeStart ? dateToUTC(values.createTimeStart) : '',
        createTimeEnd: values.createTimeEnd ? dateToUTC(values.createTimeEnd) : ''
      }
    })
    this.setState({ loading: true })
    const newParams = { page: 0, size: this.PageSize, ...fidldsValue, ...params }
    get('backups', newParams).then(res => {
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

  add = () => {
    console.log(this.name)
    post('backups', {
      backupName: this.name
    }).then(res => {
      notification.success({ message: '新增成功' })
      this.setState({ addModal: false })
      this.fetch()
    })
  }

  restore = id => {
    put(`backups/${id}`).then(res => {
      notification.success({ message: '还原成功' })
      this.fetch()
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
        title: '备份名称',
        align: 'center',
        dataIndex: 'backupName',
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
        title: '备份时间',
        dataIndex: 'createTime',
        align: 'center',
        render: text => {
          return text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''
        }
      },
      {
        title: '备份人',
        align: 'center',
        dataIndex: 'creator',
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
          return (
            <div>
              <Popconfirm
                title='确认还原？'
                icon={<Icon type='question-circle-o' style={{ color: 'yellow' }} />}
                onConfirm={() => {
                  this.restore(record.id)
                }}
              >
                <Button type='link' size='small'>
                  还原
                </Button>
              </Popconfirm>
            </div>
          )
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
                          {getFieldDecorator('backupName', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='查询时段起'>
                          {getFieldDecorator('createTimeStart', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='查询时段止'>
                          {getFieldDecorator('createTimeEnd', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Button type='primary' onClick={() => this.fetch()} style={{ marginLeft: 10 }}>
                          搜索
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Form>
          <Divider />
          <Button
            style={{ marginRight: 20 }}
            type='primary'
            onClick={() => {
              this.setState({ addModal: true })
            }}
          >
            新增备份
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
        <Modal
          visible={this.state.addModal}
          width={400}
          title='备份数据'
          destroyOnClose
          okText='确定'
          onOk={() => this.add()}
          onCancel={() => {
            this.setState({ addModal: false })
          }}
        >
          <div>
            <span style={{ marginTop: 110 }}>
              <span>请输入备份名称：</span>
              <Input
                autoFocus
                onChange={e => {
                  this.name = e.target.value
                }}
                style={{ width: 200 }}
              />
            </span>
          </div>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(List)
