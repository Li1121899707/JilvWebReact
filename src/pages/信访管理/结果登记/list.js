import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Alert, Divider, Table, Tag } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import { get } from '@/utils/http'
// import { dateToUTC } from '@/utils/common'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'

const { Option } = Select

class List extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      dataSource: [],
      secondList: []
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
    this.managementMode = ['自办', '转办', '交办', '督办', '协调']
    this.problemType = ['政治纪律', '组织纪律', '廉洁纪律', '群众纪律', '工作纪律', '生活纪律']
    this.managementStatus = ['已登记', '已填写拟办意见', '已审批', '已上会', '谈话函询中', '初步核实中', '审查调查中', '审理中', '已办结', '暂存待查']
    this.clueList = [
      {
        name: '政治纪律',
        id: '政治纪律',
        children: [
          {
            name: '自行其是，贯彻落实党的有关方针政策路线不力',
            id: '自行其是，贯彻落实党的有关方针政策路线不力'
          },
          {
            name: '不履行全面从严治党主体责任、监督责任或履职不力',
            id: '不履行全面从严治党主体责任、监督责任或履职不力'
          },
          {
            name: '搞团团伙伙、结党营私、拉帮结派、培植个人势力等非组织活动',
            id: '搞团团伙伙、结党营私、拉帮结派、培植个人势力等非组织活动'
          },
          {
            name: '不按规定向组织请示、报告重大事项',
            id: '不按规定向组织请示、报告重大事项'
          },
          {
            name: '对抗组织审查',
            id: '对抗组织审查'
          },
          {
            name: '组织、参与宗教活动、迷信活动',
            id: '组织、参与宗教活动、迷信活动'
          }
        ]
      },
      {
        name: '组织纪律',
        id: '组织纪律',
        children: [
          {
            name: '违反民主集中制原则，个人或少数人决定重大事项',
            id: '违反民主集中制原则，个人或少数人决定重大事项'
          },
          {
            name: '故意规避集体决策，或借集体决策名义集体违规',
            id: '故意规避集体决策，或借集体决策名义集体违规'
          },
          {
            name: '隐瞒不报个人有关事项，篡改、伪造个人档案资料',
            id: '隐瞒不报个人有关事项，篡改、伪造个人档案资料'
          },
          {
            name: '违规招录和提拔人员',
            id: '违规招录和提拔人员'
          },
          {
            name: '违规办理因私出国（境）证件',
            id: '违规办理因私出国（境）证件'
          }
        ]
      },
      {
        name: '廉洁纪律',
        id: '廉洁纪律',
        children: [
          {
            name: '以贷谋私，违规发放贷款',
            id: '以贷谋私，违规发放贷款'
          },
          {
            name: '以权谋私、利用职务上的影响为他人谋取私利，收受对方好处费',
            id: '以权谋私、利用职务上的影响为他人谋取私利，收受对方好处费'
          },
          {
            name: '违规经商办企业',
            id: '违规经商办企业'
          },
          {
            name: '送礼金，或违规接受礼品礼金和服务',
            id: '送礼金，或违规接受礼品礼金和服务'
          },
          {
            name: '违规组织、参加公款宴请等',
            id: '违规组织、参加公款宴请等'
          },
          {
            name: '违规自定薪酬或滥发津贴、补贴、奖金等',
            id: '违规自定薪酬或滥发津贴、补贴、奖金等'
          },
          {
            name: '公款旅游',
            id: '公款旅游'
          },
          {
            name: '违规配备、购买、更换、装饰、使用公务交通工具，公车私用等',
            id: '违规配备、购买、更换、装饰、使用公务交通工具，公车私用等'
          },
          {
            name: '超标准配备、使用办公用房',
            id: '超标准配备、使用办公用房'
          }
        ]
      },
      {
        name: '群众纪律',
        id: '群众纪律',
        children: [
          {
            name: '侵犯群众知情权，不按规定公开党务、财务等',
            id: '侵犯群众知情权，不按规定公开党务、财务等'
          },
          {
            name: '吃拿卡要，作风“生冷硬”',
            id: '吃拿卡要，作风“生冷硬”'
          },
          {
            name: '参与涉黑涉恶活动、为黑恶势力充当“保护伞”',
            id: '参与涉黑涉恶活动、为黑恶势力充当“保护伞”'
          },
          {
            name: '盲目铺摊子、上项目',
            id: '盲目铺摊子、上项目'
          }
        ]
      },
      {
        name: '工作纪律',
        id: '工作纪律',
        children: [
          {
            name: '不担当，不作为，贯彻执行、检查督促落实上级决策部署不力',
            id: '不担当，不作为，贯彻执行、检查督促落实上级决策部署不力'
          },
          {
            name: '形式主义、官僚主义',
            id: '形式主义、官僚主义'
          },
          {
            name: '党员被判处刑罚后，不给予党纪处分，或不落实被处分人党籍、职务、职级、待遇等事项',
            id: '党员被判处刑罚后，不给予党纪处分，或不落实被处分人党籍、职务、职级、待遇等事项'
          },
          {
            name: '干预司法活动、执纪纪法活动',
            id: '干预司法活动、执纪纪法活动'
          }
        ]
      },
      {
        name: '生活纪律',
        id: '生活纪律',
        children: [
          {
            name: '生活奢靡、贪图享乐、追求低级趣味，造成不良影响',
            id: '生活奢靡、贪图享乐、追求低级趣味，造成不良影响'
          },
          {
            name: '对配偶、子女及其配偶失管失教，造成不良影响或者严重后果',
            id: '对配偶、子女及其配偶失管失教，造成不良影响或者严重后果'
          },
          {
            name: '男女私生活问题造成不良影响',
            id: '男女私生活问题造成不良影响'
          }
        ]
      },
      {
        name: '诉求',
        id: '诉求',
        children: []
      },
      {
        name: '其他',
        id: '其他',
        children: []
      }
    ]
    this.mode = this.props.match.params.type
    this.type = this.props.location.state ? this.props.location.state.type : ''
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = (params = {}) => {
    let processDefinitionKey = ProcessDefinitionKey
    let val = {}
    let search = ''
    this.props.form.validateFields((err, values) => {
      console.log(values)
      //字符串拼接搜索条件  逗号拼接
      for (let item in values) {
        console.log(values[item])
        if (values[item]) {
          if (values[item]._isAMomentObject) {
            values[item] = moment(values[item]).format('YYYY-MM-DD')
          }
          search += `,${item}${values[item]}`
        }
      }
      search = search ? search.substring(1) : ''
      search += ',status=已办结'
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

  renderBtn = record => {
    const { wenTiXianSuo_status, wenTiXianSuo_chuLiFangShi, wenTiXianSuo_childStatus, wenTiXianSuo_chuZhiFangShi } = record.form
    const { processInstanceId } = record
    let operateBtn = null
    return (
      <div>
        <Button
          type='link'
          size='small'
          onClick={() => {
            router.push(`/admin/petition/clue/show/${record.processInstanceId}/dengJiJieGuo`)
          }}
        >
          查看
        </Button>
        {/*<Button*/}
        {/*  type='link'*/}
        {/*  size='small'*/}
        {/*  onClick={() => {*/}
        {/*    router.push(`/admin/petition/clue/add/${record.processInstanceId}/register`)*/}
        {/*  }}*/}
        {/*>*/}
        {/*  案件抽查*/}
        {/*</Button>*/}
        {operateBtn && (
          <Button
            type='link'
            size='small'
            onClick={() => {
              router.push(operateBtn.link)
            }}
          >
            {operateBtn.label}
          </Button>
        )}
      </div>
    )
  }

  changeSecondList = e => {
    this.props.form.setFieldsValue({ 'wenTiXianSuo_wenTiErJiFenLei=': '' })
    for (let item of this.clueList) {
      if (item.name === e) {
        this.setState({
          secondList: item.children
        })
      }
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
                            <Select
                              allowClear
                              onChange={e => {
                                this.changeSecondList(e)
                              }}
                            >
                              {this.clueList.map((item, index) => {
                                return (
                                  <Option key={index} value={item.name}>
                                    {item.name}
                                  </Option>
                                )
                              })}
                            </Select>
                          )}
                        </Form.Item>
                      </td>
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
                        <Form.Item label='办理状态'>
                          {getFieldDecorator('status=', {
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
                            <Select allowClear disabled={this.state.secondList.length === 0}>
                              {this.state.secondList.map((item, index) => {
                                return (
                                  <Option key={index} value={item.name}>
                                    {item.name}
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
                    </tr>
                    <tr>
                      <td>
                        <Form.Item label='四种形态'>
                          {getFieldDecorator('dengJiJieGuo_siZhongXingTai=', {
                            // getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                            initialValue: this.type
                          })(
                            <Select allowClear>
                              <Option value='第一种形态'>第一种形态</Option>
                              <Option value='第二种形态'>第二种形态</Option>
                              <Option value='第三种形态'>第三种形态</Option>
                              <Option value='第四种形态'>第四种形态</Option>
                            </Select>
                          )}
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
export default Form.create()(List)
