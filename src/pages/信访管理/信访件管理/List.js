import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Popconfirm, Icon, notification } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import { del, get, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'
import UploadForFiles from '@/components/upload/uploadForFiles'

const { Option } = Select

class List extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      name: '',
      url: '',
      templateUrl: '',
      dataSource: []
    }
    this.managementMode = ['自办', '转办', '交办', '督办', '协调']
    this.letterSource = ['自治区纪委监委转', '内蒙古银保监局转', '自治区联社领导转', '盟市纪委监委转', '公众号', '举报信箱', '其他']
    this.managementStatus = ['信访件已导入', '谈话函询', '问题线索', '审查调查', '审理管理']
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = {}) => {
    let fidldsValue = {}
    this.props.form.validateFields((err, values) => {
      values.endTime = moment(values.endTime).add(1, 'd')
      fidldsValue = {
        ...values,
        startTime: values.startTime ? dateToUTC(values.startTime) : '',
        endTime: values.endTime ? dateToUTC(values.endTime) : ''
      }
      console.log(values)
    })
    this.setState({ loading: true })
    const newParams = { page: 0, size: this.PageSize, ...fidldsValue, ...params }
    get('petitions/search', newParams).then(res => {
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

  handleCancelForFile = () => {
    this.setState({
      uploadModal: false
    })
    this.fetch()
  }

  delete = id => {
    del(`petitions/${id}`).then(res => {
      notification.success({ message: '删除成功' })
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
        title: '信访件编号',
        align: 'center',
        dataIndex: 'petitionNum',
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
        dataIndex: 'informee',
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
        dataIndex: 'informeeUnit',
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
        dataIndex: 'informeePost',
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
        title: '导入时间',
        dataIndex: 'inputTime',
        align: 'center',
        render: text => {
          return text ? moment(text).format('YYYY-MM-DD') : ''
        }
      },
      {
        title: '线索编号',
        align: 'center',
        dataIndex: 'reportNum',
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
        title: '线索来源',
        align: 'center',
        dataIndex: 'source',
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
        dataIndex: 'reporter',
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
          console.log(record)
          return (
            <div>
              <Button
                type='link'
                size='small'
                onClick={() => {
                  router.push(`/admin/letters/show/${record.id}/register`)
                }}
              >
                详情
              </Button>
              {record.state === '信访件已导入' ? (
                <span>
                  <Popconfirm
                    title='确认删除？'
                    icon={<Icon type='question-circle-o' style={{ color: 'red' }} />}
                    onConfirm={() => {
                      this.delete(record.id)
                    }}
                  >
                    <Button type='link' size='small' style={{ color: '#f5222d' }}>
                      删除
                    </Button>
                  </Popconfirm>
                </span>
              ) : (
                ''
              )}
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
                        <Form.Item label='导入时间起'>
                          {getFieldDecorator('startTime', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='导入时间止'>
                          {getFieldDecorator('endTime', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='反映人'>
                          {getFieldDecorator('reporter', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='信访件来源'>
                          {getFieldDecorator('source', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.letterSource.map(item => {
                                return <Option value={item}>{item}</Option>
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='办理状态'>
                          {getFieldDecorator('state', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.managementStatus.map((item, index) => {
                                return (
                                  <Option key={index} value={item}>
                                    {item}
                                  </Option>
                                )
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='被反映人'>
                          {getFieldDecorator('informee', {
                            getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(<Input disabled={this.state.disable} onChange={this.onChange} allowClear />)}
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
          <Button style={{ marginRight: 20 }} type='primary' onClick={() => router.push(`/admin/letters/add/register`)}>
            登记新的信访件
          </Button>
          <Button
            style={{ marginLeft: 20 }}
            type='primary'
            onClick={() =>
              this.setState({
                uploadModal: true,
                name: '信访件',
                url: 'petitions/importExcel',
                templateUrl: 'petitions/getExcel'
              })
            }
          >
            批量导入信访件
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
            <UploadForFiles
              visible={this.state.uploadModal}
              handleCancel={this.handleCancelForFile}
              templateUrl={this.state.templateUrl}
              name={this.state.name}
              url={this.state.url}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default Form.create()(List)
