/**
 * @Author 王舒宁
 * @Date 2020/3/13 14:19
 **/

import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, Popconfirm, Icon, notification, Modal } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import { del, get, post, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'
import UploadForFiles from '@/components/upload/uploadForFiles'
import { untils } from '@/pages/信访管理/common/untils'

const { Option } = Select
const ProcessDefinitionKey = 'nmnxxfj_v1'

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
      dataSource: [],
      leaderList: []
    }
    this.managementMode = ['自办', '转办', '交办', '督办', '协调']
    this.letterSource = ['自治区纪委监委转', '内蒙古银保监局转', '自治区联社领导转', '盟市纪委监委转', '公众号', '举报信箱', '其他']
    this.managementStatus = ['信访件已导入', '谈话函询', '问题线索', '审查调查', '审理管理']
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = {}) => {
    let processDefinitionKey = ProcessDefinitionKey
    let search = ''
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
      search = search ? search.substring(1) : ''
      // search += ',status=问题线索'
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

  handleCancelForFile = () => {
    this.setState({
      uploadModal: false
    })
    this.fetch()
  }

  submit = () => {
    const values = {}
    values.status = '已呈批'
    post(
      `thread/claimAndComplete?taskId=${
        this.record.historicUserTaskInstanceList[this.record.historicUserTaskInstanceList.length - 1].taskInstanceId
      }&processInstanceId=${this.record.processInstanceId}&nextAssignee=${this.state.leader}&isLocal=${0}`,
      { ...values }
    ).then(res => {
      notification.success({ message: '呈批成功' })
      this.setState({
        visible: false
      })
      this.fetch()
    })
  }

  delete = id => {
    del(`petitions/${id}`).then(res => {
      notification.success({ message: '删除成功' })
      this.fetch()
    })
  }

  isPermissionBtn = record => {
    // 当前用户是否有权限处理任务
    if (!window.USER) {
      notification.error({ message: '未检测到权限，请重新登陆' })
      return false
    }
    const lastestTaskUser = record.historicUserTaskInstanceList[record.historicUserTaskInstanceList.length - 1].assignee
    return !lastestTaskUser || lastestTaskUser === window.USER.userCode // 没有指派人 情况   指派人 是当前登陆用户
  }

  selectChange = (value, e) => {
    this.setState({ leader: value })
  }

  // 操作按钮权限设置
  renderBtn = record => {
    const { isUser } = this.state
    if (this.isPermissionBtn(record) && !record.ended) {
      // 如果有权限
      return (
        <>
          {record.form.status === '已登记' || record.form.status === '信访件已导入' ? (
            <Button
              size='small'
              type='link'
              onClick={() => {
                router.push(`/admin/letters/edit/${record.processInstanceId}/register`)
              }}
            >
              编辑
            </Button>
          ) : null}
          {record.form.status === '已登记' ? (
            <Button
              size='small'
              type='link'
              onClick={() => {
                router.push(`/admin/letters/${record.processInstanceId}/add/chuzhixinfang`)
              }}
            >
              呈批
            </Button>
          ) : null}
          {record.form.status === '已呈批' ? (
            <Button size='small' type='link' onClick={() => router.push(`/admin/letters/add/${record.processInstanceId}/lingdaoregister`)}>
              审批
            </Button>
          ) : null}
          {record.form.status === '审批中' ? (
            <Button size='small' type='link' onClick={() => router.push(`/admin/letters/:type/${record.processInstanceId}/lingdaoregister`)}>
              审批
            </Button>
          ) : null}
        </>
      )
    }
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
        dataIndex: 'form.petitionNum',
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
        dataIndex: 'form.informee',
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
        dataIndex: 'form.informeeUnit',
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
        dataIndex: 'form.informeePost',
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
        dataIndex: 'form.inputTime',
        align: 'center',
        render: text => {
          return text ? moment(text).format('YYYY-MM-DD') : ''
        }
      },
      {
        title: '线索编号',
        align: 'center',
        dataIndex: 'form.reportNum',
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
        dataIndex: 'form.source',
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
        dataIndex: 'form.reporter',
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
        dataIndex: 'form.status',
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
              {record.form.status === '已登记' || record.form.status === '信访件已导入' ? (
                <Button
                  type='link'
                  size='small'
                  onClick={() => {
                    router.push(`/admin/letters/show/${record.processInstanceId}/register`)
                  }}
                >
                  详情
                </Button>
              ) : (
                <Button
                  type='link'
                  size='small'
                  onClick={() => {
                    router.push(`/admin/letters/show/${record.processInstanceId}/lingdaoregister`)
                  }}
                >
                  详情
                </Button>
              )}
              <Button type='link' size='small'>
                回复
              </Button>

              {this.renderBtn(record)}
              {record.state === '信访件已导入' ? (
                <span>
                  <Button
                    type='link'
                    size='small'
                    onClick={() => {
                      router.push(`/admin/letters/edit/${record.processInstanceId}/register`)
                    }}
                  >
                    编辑
                  </Button>

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
                name: '批量导入信访件',
                url: 'petitions/importTxt',
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
              type='.txt'
              name={this.state.name}
              url={this.state.url}
            />
          </div>
        </div>
        <Modal
          width='500px'
          visible={this.state.visible}
          title='选择呈批领导'
          destroyOnClose
          // key={Math.random()}
          onOk={this.submit}
          onCancel={() => {
            this.setState({
              visible: false,
              laeder: ''
            })
          }}
        >
          <Select style={{ width: 200 }} onChange={this.selectChange}>
            {this.state.leaderList.map((item, index) => (
              <option key={index} value={item.userCode}>
                {item.userName}
              </option>
            ))}
          </Select>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(List)
