import { router, Link } from 'umi'
import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Modal } from 'antd'
import Breadcrumbs from '@/components/Breadcrumb'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import moment from 'moment'
import { get } from '@/utils/http'

const { Option } = Select

class AnJuanGuanLi extends Component {
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
    let processDefinitionKey = ProcessDefinitionKey
    const pagePath = this.props.match.url
    let flow_path = ''
    switch (pagePath) {
      case '/admin/petition/talk/archive':
        flow_path = '谈话函询'
        break
      case '/admin/petition/check/archive':
        flow_path = '初步核实'
        break
      case '/admin/petition/investigation/archive':
        flow_path = '审查调查'
        break
      case '/admin/petition/management/archive':
        flow_path = '审理管理'
        break
      case '/admin/anjuan/list':
        flow_path = null
        break
      default:
        flow_path = null
    }
    let search = flow_path ? `flow_path~${flow_path}` : ''
    search += flow_path ? `,status=${flow_path}` : ''
    console.log(search)
    // let search = flow_path? `status=${flow_path}`:''
    this.props.form.validateFields((err, values) => {
      //字符串拼接搜索条件  逗号拼接
      for (let item in values) {
        if (values[item]) {
          if (values[item]._isAMomentObject) {
            //搜索时间没有时分秒 因此搜索不到选取日期 如：搜索2020-3-13 到 2020-3-15之间的数据  搜索不到3-13和3-15两天的数据   所以需在搜索前相应的加减一天
            if (item.indexOf('<') > -1) {
              values[item] = moment(values[item]).add(1, 'd')
            }
            values[item] = moment(values[item]).format('YYYY-MM-DD')
          }

          search += `,${item}${values[item]}`

        }
      }
      get(`activiti/process/instances/all?processDefinitionKey=${processDefinitionKey}&search=${search}`, {
        size: this.state.pagination.pageSize,
        page: 0,
        ...params
      }).then(res => {
        const { pagination } = this.state
        pagination.total = parseInt(res.headers['x-total-count'], 10)
        this.setState({
          dataSource: res.data,
          pagination
        })
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
        title: '案卷提名',
        align: 'center',
        dataIndex: 'form.anJuan.name'
      },
      {
        title: '案卷编号',
        align: 'center',
        dataIndex: 'form.wenTiXianSuo_anjuanbianhao',
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
        dataIndex: 'form.wenTiXianSuo_xuHao'
      },
      {
        title: '被反映人',
        align: 'center',
        dataIndex: 'form.wenTiXianSuo_beiFanYingRen'
      },
      {
        title: '建档日期',
        dataIndex: 'form.wenTiXianSuo_dengJiTime',
        align: 'center',
        render: text => {
          return text ? moment(text).format('YYYY-MM-DD') : text
        }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operate',
        render: (text, record) => {
          return <Link to={`${this.props.match.url}/${record.processInstanceId}`}>详情</Link>
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
                          {getFieldDecorator('wenTiXianSuo_dengJiTime>', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='建档时间止'>
                          {getFieldDecorator('wenTiXianSuo_dengJiTime<', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='办理方式'>
                          {getFieldDecorator('wenTiXianSuo_chuLiFangShi=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                          })(
                            <Select allowClear>
                              <Option value='自办'>自办</Option>
                              <Option value='转办'>转办</Option>
                              <Option value='交办'>交办</Option>
                              <Option value='督办'>督办</Option>
                              <Option value='协调'>协调</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='被反映人'>
                          {getFieldDecorator('wenTiXianSuo_beiFanYingRen~', {
                            getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(<Input disabled={this.state.disable} onChange={this.onChange} allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='反映人'>
                          {getFieldDecorator('wenTiXianSuo_fanYingRen~', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='线索编号'>
                          {getFieldDecorator('wenTiXianSuo_xuHao~', {
                            initialValue: defaultValue ? defaultValue.customerinfoIfgroup : ''
                          })(<Input allowClear />)}
                        </Form.Item>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='案卷编号'>
                          {getFieldDecorator('wenTiXianSuo_anjuanbianhao~', {
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
          <div>
            <Table
              rowKey={record => record.processInstanceId}
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
export default Form.create()(AnJuanGuanLi)
