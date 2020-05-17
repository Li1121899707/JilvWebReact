import { router } from 'umi'
import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Icon, Popconfirm, notification, Modal } from 'antd'
import moment from 'moment'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'

const { Option } = Select

class AnJuanList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      addModal: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: [
        {
          title: '00001',
          num: '10008',
          xiansuoNum: '001',
          name: '张三',
          date: '2019.05.12'
        }
      ]
    }
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
        title: '案卷提名',
        align: 'center',
        dataIndex: 'title',
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
        title: '案卷编号',
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
        title: '线索编号',
        align: 'center',
        dataIndex: 'xiansuoNum',
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
        dataIndex: 'name',
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
        title: '建档日期',
        dataIndex: 'date',
        align: 'center'
        // render: text => {
        //   return moment(text).format('YYYY-MM-DD')
        // }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operate',
        render: text => {
          return (
            <div>
              <Button type='link' size='small'>
                填加文档
              </Button>
              <Button type='link' size='small'>
                查看
              </Button>
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
                        <Form.Item label='建档时间起'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_jianDangShiJian>', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='建档时间止'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_jianDangShiJian<', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='处理结论'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_chuLiJieLun=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              <Option value='全部'>全部</Option>
                              <Option value='了结'>了结</Option>
                              <Option value='审查调查'>审查调查</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='被反映人'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_beiFanYingRen~', {
                            getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(<Input disabled={this.state.disable} onChange={this.onChange} allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='反映人'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_fanYingRen~', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='线索编号'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_xianSuoBianHao~', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='案卷编号'>
                          {getFieldDecorator('shenLiGuanLi_anJuan_anJuanBianHao~', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Button type='primary' onClick={() => this.fetch()} style={{ marginRight: '60%' }}>
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
          <Button
            style={{ marginRight: 20 }}
            type='primary'
            onClick={() => {
              this.setState({ addModal: true })
            }}
          >
            创建新案卷
          </Button>
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
        <Modal
          visible={this.state.addModal}
          width={1000}
          title='创建审理卷'
          destroyOnClose
          okText='创建'
          onOk={() => {
            router.push('/admin/petition/manage/detail')
          }}
          onCancel={() => {
            this.setState({ addModal: false })
          }}
        >
          <div>
            <span style={{ marginTop: 10 }}>
              <span>线索编号：</span>
              <Input style={{ width: 150 }} />
            </span>
            <span style={{ marginTop: 10, marginLeft: 10 }}>
              <span>机构名称：</span>
              <Input style={{ width: 150 }} />
            </span>
            <span style={{ marginTop: 10, marginLeft: 10 }}>
              <span>单位名称：</span>
              <Input style={{ width: 150 }} />
            </span>
            <span style={{ marginTop: 10, marginLeft: 10 }}>
              <span>职务：</span>
              <Input style={{ width: 150 }} />
            </span>
            <div style={{ marginTop: 10 }}>
              <span>案卷题名：</span>
              <Input style={{ width: 812 }} />
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AnJuanList)
