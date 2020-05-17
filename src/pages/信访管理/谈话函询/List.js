import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag, notification, Modal, Upload } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, post } from '@/utils/http'
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
      uploadModal: false
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
      '自治区纪委监委转',
      '内蒙古银保监局转',
      '自治区联社领导转',
      '盟市纪委监委转',
      '公众号',
      '举报信箱',
      '其他'
    ]
    this.status = ['已登记', '审批中', '已审批', '待填谈话函询', '已提交处置意见', '处置意见审批中', '处置意见已审批', '再次谈话函询']
    this.mode = this.props.match.params.type
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
      search += ',status=谈话函询'
      get(`activiti/process/instances/all?processDefinitionKey=${processDefinitionKey}&search=${search}`, {
        size: this.state.pagination.pageSize,
        page: 0,
        ...params
      }).then(res => {
        res.data.forEach((item, index) => {
          res.data[index].form.tanHuaHanXun_RiQi = item.form.tanHuaHanXun_RiQi ? moment(item.form.tanHuaHanXun_RiQi).format('YYYY-MM-DD') : null
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

  renderBtn = record => {
    const { tanHuaHanXun_status, tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi } = record.form
    const { processInstanceId } = record
    let houXuChuZhiFangShi = ['谈话提醒', '批评教育', '责令检查', '诫勉谈话', '了结澄清']
    let operateBtn = null
    if (this.isPermissionBtn(record)) {
      // 如果有权限
      if (tanHuaHanXun_status === '已登记' || tanHuaHanXun_status === '审批中') {
        operateBtn = {
          link: `/admin/petition/talk/add/${processInstanceId}/ShenPiChengPi`,
          label: '审批'
        }
      } else if (tanHuaHanXun_status === '待填谈话函询') {
        operateBtn = {
          link: `/admin/petition/talk/${processInstanceId}/ChengPi`,
          label: '填写谈话函询'
        }
      } else if (tanHuaHanXun_status === '已审批') {
        operateBtn = {
          link: `/admin/petition/talk/${processInstanceId}/ChuZhiYiJian`,
          label: '填写处置意见'
        }
      } else if (tanHuaHanXun_status === '已提交处置意见') {
        operateBtn = {
          link: `/admin/petition/talk/add/${processInstanceId}/chuZhiYiJianShenPi`,
          label: '审批'
        }
      } else if (tanHuaHanXun_status === '处置意见审批中') {
        operateBtn = {
          link: `/admin/petition/talk/add/${processInstanceId}/chuZhiYiJianShenPi`,
          label: '审批'
        }
      } else if (tanHuaHanXun_status === '处置意见已审批' && houXuChuZhiFangShi.includes(tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi)) {
        operateBtn = {
          link: `/admin/petition/clue/add/${processInstanceId}/dengJiJieGuo`,
          label: '登记结果'
        }
      } else if (tanHuaHanXun_status === '处置意见已审批' && tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi === '再次谈话函询') {
        operateBtn = {
          link: `/admin/petition/talk/${processInstanceId}/ChengPi`,
          label: '填写再次谈话函询'
        }
      }
    }
    let chakanBtn = null

    // 如果有权限
    if (tanHuaHanXun_status === '已登记' || tanHuaHanXun_status === '审批中') {
      chakanBtn = {
        link: `/admin/petition/talk/show/${processInstanceId}/ShenPiChengPi`,
        label: '查看'
      }
    } else if (tanHuaHanXun_status === '待填谈话函询') {
      chakanBtn = {
        link: `/admin/petition/clue/${record.processInstanceId}/detail`,
        label: '填写谈话函询'
      }
    } else if (tanHuaHanXun_status === '已审批') {
      chakanBtn = {
        link: `/admin/petition/talk/show/${processInstanceId}/ShenPiChengPi`,
        label: '查看'
      }
    } else if (tanHuaHanXun_status === '已提交处置意见') {
      chakanBtn = {
        link: `/admin/petition/talk/show/${processInstanceId}/chuZhiYiJianShenPi`,
        label: '查看'
      }
    } else if (tanHuaHanXun_status === '处置意见审批中') {
      chakanBtn = {
        link: `/admin/petition/talk/show/${processInstanceId}/chuZhiYiJianShenPi`,
        label: '查看'
      }
    } else if (tanHuaHanXun_status === '处置意见已审批' && houXuChuZhiFangShi.includes(tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi)) {
      chakanBtn = {
        link: `/admin/petition/talk/show/${processInstanceId}/chuZhiYiJianShenPi`,
        label: '查看'
      }
    } else if (tanHuaHanXun_status === '处置意见已审批' && tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi === '再次谈话函询') {
      chakanBtn = {
        link: `/admin/petition/talk/show/${processInstanceId}/chuZhiYiJianShenPi`,
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
            this.setState({ visible: true })
          }}
        >
          填写月度办理进度
        </Button>
        <Button
          type='link'
          size='small'
          onClick={() => {
            router.push(chakanBtn.link)
          }}
        >
          查看
        </Button>

        {!record.form.isChouCha && (
          <Button type='link' onClick={() => this.chouCha(record)}>
            抽查
          </Button>
        )}

        {record.form.isChouCha === '否' && (
          <Button
            type='link'
            onClick={() => {
              this.record = record
              this.setState({
                uploadModal: true
              })
            }}
          >
            提交抽查结果
          </Button>
        )}

        {operateBtn && (
          <Button
            type='link'
            size='small'
            onClick={() => {
              operateBtn.label === '上会' ? this.endTask(record) : router.push(operateBtn.link)
            }}
          >
            {operateBtn.label}
          </Button>
        )}
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
      if (this.record.form.tanHuanHanXun_yueDuJinDu) {
        tanHuaArr = this.record.form.tanHuanHanXun_yueDuJinDu
      }
      const obj = {
        yueDuBanLiQingKuang: this.monthly,
        yueDuBanLiQingKuangRiQi: moment(Date.now()).format('YYYY-MM-DD')
      }
      tanHuaArr.push(obj)
      val.tanHuanHanXun_yueDuJinDu = tanHuaArr
      val.isTanHuaHanXun_yueDuJinDu = 'true'
      post(`activiti/setProcessVariables/${processId}`, val).then(res => {
        notification.success({ message: '提交成功' })
        this.record = ''
        this.monthly = ''
        this.setState({
          visible: false
        })
      })
    } else {
      notification.info({ message: '进度说明不能为空' })
    }
  }

  chouCha = record => {
    const val = {}
    val.isChouCha = '否'
    console.log(record)
    post(`activiti/setProcessVariables/${record.processInstanceId}`, val).then(res => {
      this.fetch()
      notification.success({ message: '提交成功' })
    })
  }

  handleUpload = () => {
    const val = {}
    val.isChouCha = '是'
    val.chouChaFiles = this.fileRef.state.fileList
    post(`activiti/setProcessVariables/${this.record.processInstanceId}`, val).then(res => {
      this.setState({
        uploadModal: false
      })
      this.record = ''
      this.fetch()
      notification.success({ message: '提交成功' })
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
        title: '谈话函询日期',
        dataIndex: 'form.tanHuaHanXun_RiQi',
        align: 'center',
        render: text => {
          return text
          // return moment(text).format('YYYY-MM-DD')
        }
      },
      {
        title: '处置方法',
        align: 'center',
        dataIndex: 'form.tanHuaHanXun_chuZhiYiJian_houXuChuZhiFangShi',
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
        dataIndex: 'form.tanHuaHanXun_status',
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
                        <Form.Item label='谈话函询日期起'>
                          {getFieldDecorator('tanHuaHanXun_RiQi>', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='谈话函询日期止'>
                          {getFieldDecorator('tanHuaHanXun_RiQi<', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            // initialValue: defaultValue ? defaultValue.customerinfoName : ''
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item label='办理状态'>
                          {getFieldDecorator('tanHuaHanXun_status=', {
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
                        <Button type='primary' onClick={() => this.fetch()}>
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
        <Modal
          width='500px'
          visible={this.state.visible}
          title='月度办理进度说明'
          destroyOnClose
          // key={Math.random()}
          onOk={this.process}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          <Input.TextArea onChange={e => (this.monthly = e.target.value)} />
        </Modal>
        <div style={{ textAlign: 'left' }}>
          <Modal
            width='500px'
            visible={this.state.uploadModal}
            title='上传抽查呈批表和相关文档'
            destroyOnClose
            // key={Math.random()}
            // onOk={this.handleCancelForFile}
            // onCancel={this.handleCancelForFile}
            footer={[
              // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
              <Button
                type='primary'
                onClick={this.handleUpload}
                // disabled={this.state.fileList.length === 0}
                // loading={this.state.uploading}
                key={Math.random()}
              >
                确定
              </Button>,
              <Button
                onClick={() => {
                  this.handleCancelForFile()
                  this.fetch()
                }}
                key={Math.random()}
              >
                关闭
              </Button>
            ]}
          >
            <UploadComp
              key={0}
              fileList={this.state.dataSource.chouChaFiles || []}
              ref={ref => {
                this.fileRef = ref
              }}
            />{' '}
          </Modal>
        </div>
      </div>
    )
  }
}
export default Form.create()(List)
