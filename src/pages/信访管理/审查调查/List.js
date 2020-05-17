import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, notification, Modal, message } from 'antd'
import { router } from 'umi'
import moment from 'moment'
import { get, post } from '@/utils/http'
import Breadcrumbs from '@/components/Breadcrumb'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import UploadComp from '@/components/upload/Upload'

const { Option } = Select

class List extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: [],
      visible: false,
      yueDuModal: false
    }
    this.clueSource = [
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
    this.status = ['未登记', '已登记', '审批中', '已审批', '已上传回执', '立案审查方案已登记', '立案审查方案审批中', '立案审查报告已审批']
    this.record = {}
    this.record = ''
    this.monthly = ''
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = {}) => {
    let processDefinitionKey = ProcessDefinitionKey
    let val = {}
    let search = ''
    this.props.form.validateFields((err, values) => {
      // console.log(values)
      //字符串拼接搜索条件  逗号拼接
      for (let item in values) {
        console.log(values[item])
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
      search += ',status=审查调查，shenChaDiaoCha_childstatus=立案准备'
      get(`activiti/process/instances/all?processDefinitionKey=${processDefinitionKey}&search=${search}`, {
        size: this.state.pagination.pageSize,
        page: 0,
        ...params
      }).then(res => {
        res.data.forEach((item, index) => {
          res.data[index].form.shenChaDiaoCha_RiQi = item.form.shenChaDiaoCha_RiQi ? moment(item.form.shenChaDiaoCha_RiQi).format('YYYY-MM-DD') : null
        })
        const { pagination } = this.state
        pagination.total = parseInt(res.headers['x-total-count'], 10)
        this.setState({
          dataSource: res.data,
          pagination
        })
      })
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

  endTask = record => {
    if (this.fileRef.state.fileList.length === 0) {
      notification.error({ message: '请上传回执书' })
      return false
    }
    let val = {}
    const { shenChaDiaoCha_status } = record.form
    val.shenChaDiaoCha_status = '已上传回执'
    val.shangChuanHuiZhi_files = this.fileRef.state.fileList
    post(
      `activiti/completeTask?taskId=${record.historicUserTaskInstanceList[record.historicUserTaskInstanceList.length - 1].taskInstanceId}`,
      val
    ).then(res => {
      notification.success({ message: '提交成功' })
      this.fetch()
    })
  }

  showModal = record => {
    this.record = record
    this.setState({
      visible: true
    })
  }

  handleOk = e => {
    this.setState({
      visible: false
    })
    this.endTask(this.record)
  }

  handleCancel = e => {
    this.setState({
      visible: false
    })
  }

  renderBtn = record => {
    const { shenChaDiaoCha_status, tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi } = record.form
    const { processInstanceId } = record
    let operateBtn = null
    if (this.isPermissionBtn(record)) {
      // 如果有权限
      if (shenChaDiaoCha_status === '未登记') {
        operateBtn = {
          link: `/admin/petition/investigation/${processInstanceId}/lian`,
          label: '填写立案审查'
        }
      } else if (shenChaDiaoCha_status === '已登记' || shenChaDiaoCha_status === '审批中') {
        operateBtn = {
          link: `/admin/petition/investigation/add/${processInstanceId}/liAnShenChaChengShenPi`,
          label: '审批'
        }
      } else if (shenChaDiaoCha_status === '已审批') {
        operateBtn = {
          link: `/admin/petition/investigation/${processInstanceId}/liAnShenChaChengShenPi`,
          label: '上传回执书'
        }
      } else if (shenChaDiaoCha_status === '已上传回执') {
        operateBtn = {
          link: `/admin/petition/investigation/${processInstanceId}/lianshencha`,
          label: '填写立案审查方案'
        }
      } else if (shenChaDiaoCha_status === '立案审查方案已登记' || shenChaDiaoCha_status === '立案审查方案审批中') {
        operateBtn = {
          link: `/admin/petition/investigation/add/${processInstanceId}/lianshenchashenpi`,
          label: '审批'
        }
      }
    }
    let chaKanBtn = null

    if (shenChaDiaoCha_status === '未登记') {
      chaKanBtn = {
        link: `/admin/petition/check/show/${processInstanceId}/ShenPiChuHeBaoGaoChengPi`,
        label: '填写立案审查'
      }
    } else if (shenChaDiaoCha_status === '已登记' || shenChaDiaoCha_status === '审批中') {
      chaKanBtn = {
        link: `/admin/petition/investigation/show/${processInstanceId}/liAnShenChaChengShenPi`,
        label: '查看'
      }
    } else if (shenChaDiaoCha_status === '已审批') {
      chaKanBtn = {
        link: `/admin/petition/investigation/show/${processInstanceId}/liAnShenChaChengShenPi`,
        label: '查看'
      }
    } else if (shenChaDiaoCha_status === '已上传回执') {
      chaKanBtn = {
        link: `/admin/petition/investigation/show/${processInstanceId}/liAnShenChaChengShenPi`,
        label: '查看'
      }
    } else if (shenChaDiaoCha_status === '立案审查方案已登记' || shenChaDiaoCha_status === '立案审查方案审批中') {
      chaKanBtn = {
        link: `/admin/petition/investigation/show/${processInstanceId}/lianshenchashenpi`,
        label: '查看'
      }
    }
    return (
      <div>
        <Button
          type='link'
          size='small'
          onClick={() => {
            this.record = record
            this.setState({ yueDuModal: true })
          }}
        >
          填写月度办理进度
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
            router.push(chaKanBtn.link)
          }}
        >
          查看
        </Button>
        {operateBtn && (
          <Button
            type='link'
            size='small'
            onClick={() => {
              operateBtn.label === '上传回执书' ? this.showModal(record) : router.push(operateBtn.link)
            }}
          >
            {operateBtn.label}
          </Button>
        )}
        <Modal title='上传回执书' visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <UploadComp
            key={record.wenTiXianSuo_xuHao || 0}
            fileList={record.shangChuanHuiZhi_files || []}
            ref={ref => {
              this.fileRef = ref
            }}
          />
        </Modal>
      </div>
    )
  }

  process = () => {
    const processId = this.record.processInstanceId
    const val = {}
    if (this.monthly) {
      val.yueDuBanLiQingKuang = this.monthly
      val.yueDuBanLiQingKuangRiQi = moment(Date.now()).format('YYYY-MM-DD')
      let tanHuaArr = []
      if (this.record.form.shenChaDiaoCha_yueDuJinDu) {
        tanHuaArr = this.record.form.shenChaDiaoCha_yueDuJinDu
      }
      const obj = {
        yueDuBanLiQingKuang: this.monthly,
        yueDuBanLiQingKuangRiQi: moment(Date.now()).format('YYYY-MM-DD')
      }
      tanHuaArr.push(obj)
      val.shenChaDiaoCha_yueDuJinDu = tanHuaArr
      val.isShenChaDiaoCha_yueDuJinDu = 'true'
      post(`activiti/setProcessVariables/${processId}`, val).then(res => {
        notification.success({ message: '提交成功' })
        this.record = ''
        this.monthly = ''
        this.setState({
          yueDuModal: false
        })
      })
    } else {
      notification.info({ message: '进度说明不能为空' })
    }
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
        title: '立案审查日期',
        dataIndex: 'form.shenChaDiaoCha_RiQi',
        align: 'center',
        render: text => {
          return text
          // return moment(text).format('YYYY-MM-DD')
        }
      },
      {
        title: '线索来源',
        align: 'center',
        dataIndex: 'form.wenTiXianSuo_xianSuoLaiYuan',
        render: text => {
          let formatText = ''
          if (typeof text === 'string') {
            formatText = text
          } else if (text) {
            console.log(text)
            formatText = text.join(';')
          }
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return formatText
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
        title: '办理状态',
        align: 'center',
        dataIndex: 'form.shenChaDiaoCha_status',
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
          return this.renderBtn(record)
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
                        <Form.Item label='立案审查日期起'>
                          {getFieldDecorator('shenChaDiaoCha_RiQi>', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='立案审查日期止'>
                          {getFieldDecorator('shenChaDiaoCha_RiQi<', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='办理状态'>
                          {getFieldDecorator('shenChaDiaoCha_status=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: defaultValue ? defaultValue.customerinfoGroup : ''
                          })(
                            <Select allowClear>
                              {this.status.map((item, index) => {
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
                        <Form.Item label='线索来源'>
                          {getFieldDecorator('wenTiXianSuo_xianSuoLaiYuan~', {
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
          width='500px'
          visible={this.state.yueDuModal}
          title='月度办理进度说明'
          destroyOnClose
          // key={Math.random()}
          onOk={this.process}
          onCancel={() => {
            this.setState({
              yueDuModal: false
            })
          }}
        >
          <Input.TextArea onChange={e => (this.monthly = e.target.value)} />
        </Modal>
      </div>
    )
  }
}
export default Form.create()(List)
