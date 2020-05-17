import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Alert, Divider, Table, Tag } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import { get } from '@/utils/http'
// import { dateToUTC } from '@/utils/common'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'

const { Option } = Select

class ResultList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: [{ 'form.wenTiXianSuo_xuHao': '10008' }]
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
    this.managementMode = ['全部', '自办', '转办', '交办', '督办', '协调']
    this.problemType = ['全部', '政治纪律', '组织纪律', '廉洁纪律', '群众纪律', '工作纪律', '生活纪律']
    this.managementStatus = [
      '全部',
      '已登记',
      '已填写拟办意见',
      '已审批',
      '已上会',
      '谈话函询中',
      '初步核实中',
      '审查调查中',
      '审理中',
      '已办结',
      '暂存待查'
    ]
    this.problemType2 = [
      '全部',
      '1.自行其是，贯彻落实党的有关方针政策路线不力',
      '2.不履行全面从严治党主体责任、监督责任或履职不力',
      '3.搞团团伙伙、结党营私、拉帮结派、培植个人势力等非组织活动',
      '4.不按规定想组织请示、报告重大事项',
      '5.对抗组织审查',
      '6.组织、参与宗教活动、迷信活动'
    ]
    this.mode = this.props.match.params.type
  }

  componentDidMount() {
    //this.fetch()
  }

  // fetch = (params = {}) => {
  //   let processDefinitionKey = ProcessDefinitionKey
  //   let val = {}
  //   let search = ''
  //   this.props.form.validateFields((err, values) => {
  //     console.log(values)
  //     //字符串拼接搜索条件  逗号拼接
  //     for (let item in values) {
  //       console.log(values[item])
  //       if (values[item]) {
  //         if (values[item]._isAMomentObject) {
  //           //搜索时间没有时分秒 因此搜索不到选取日期 如：搜索2020-3-13 到 2020-3-15之间的数据  搜索不到3-13和3-15两天的数据   所以需在搜索前相应的加减一天
  //           if (item.indexOf('<') > -1) {
  //             values[item] = moment(values[item]).add(1, 'd')
  //           }
  //           // if (item.indexOf('>')) {
  //           //   console.log(values[item])
  //           //   values[item] = moment(values[item]).subtract(1, 'd')
  //           //   console.log(values[item])
  //           // }
  //           values[item] = moment(values[item]).format('YYYY-MM-DD')
  //           console.log(values[item])
  //         }
  //         search += `,${item}${values[item]}`
  //       }
  //     }
  //     search = search ? search.substring(1) : ''
  //     get(`activiti/process/instances/all?processDefinitionKey=${processDefinitionKey}&search=${search}`, {
  //       size: this.state.pagination.pageSize,
  //       page: 0,
  //       ...params
  //     }).then(res => {
  //       const { pagination } = this.state
  //       pagination.total = parseInt(res.headers['x-total-count'], 10)
  //       this.setState({
  //         dataSource: res.data,
  //         pagination
  //       })
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

  // renderBtn = record => {
  //   const { wenTiXianSuo_status, wenTiXianSuo_chuLiFangShi, wenTiXianSuo_childStatus, wenTiXianSuo_chuZhiFangShi } = record.form
  //   const { processInstanceId } = record
  //   let operateBtn = null
  //   if (wenTiXianSuo_status === '未登记') {
  //     operateBtn = {
  //       link: `/admin/petition/clue/edit/${record.processInstanceId}/register`,
  //       label: '编辑'
  //     }
  //   }
  //   return (
  //     <div>
  //       <Button
  //         type='link'
  //         size='small'
  //         onClick={() => {
  //           router.push(`/admin/petition/clue/${record.processInstanceId}/detail`)
  //         }}
  //       >
  //         查看
  //       </Button>
  //       {operateBtn && (
  //         <Button
  //           type='link'
  //           size='small'
  //           onClick={() => {
  //             router.push(operateBtn.link)
  //           }}
  //         >
  //           {operateBtn.label}
  //         </Button>
  //       )}
  //     </div>
  //   )
  // }

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
        dataIndex: 'form.wenTiXianSuo_xuHao',
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
        dataIndex: 'form.wenTiXianSuo_beiFanYingRen',
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
        dataIndex: 'form.wenTiXianSuo_beiFanYingRenDanWei',
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
        dataIndex: 'form.wenTiXianSuo_beiFanYingRenZhiWu',
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
        title: '登记时间',
        dataIndex: 'form.wenTiXianSuo_dengJiTime',
        align: 'center',
        render: text => {
          return moment(text).format('YYYY-MM-DD')
        }
      },
      {
        title: '线索类型',
        align: 'center',
        dataIndex: 'form.wenTiXianSuo_wenTiLeiXing',
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
        dataIndex: 'form.wenTiXianSuo_xianSuoLaiYuan',
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
        dataIndex: 'form.wenTiXianSuo_fanYingRen',
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
        title: '办理方式',
        align: 'center',
        dataIndex: 'form.wenTiXianSuo_chuLiFangShi',
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
        dataIndex: 'form.wenTiXianSuo_status',
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
              <Button
                type='link'
                size='small'
                onClick={() => {
                  router.push(`/admin/petition/clue/add/1/resultTable`)
                }}
              >
                结果登记
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
                        <Form.Item label='导入时间起'>
                          {getFieldDecorator('wenTiXianSuo_dengJiTime>', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='导入时间止'>
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
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.managementMode.map((item, index) => {
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
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='线索反映问题类型'>
                          {getFieldDecorator('wenTiXianSuo_wenTiLeiXing=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.problemType.map((item, index) => {
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
                        <Form.Item label='线索来源'>
                          {getFieldDecorator('wenTiXianSuo_xianSuoLaiYuan=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.clueSource.map((item, index) => {
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
                        <Form.Item label='办理状态'>
                          {getFieldDecorator('wenTiXianSuo_status=', {
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
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='线索反映问题二级分类'>
                          {getFieldDecorator('wenTiXianSuo_wenTiErJiFenLei=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.problemType2.map((item, index) => {
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
export default Form.create()(ResultList)
