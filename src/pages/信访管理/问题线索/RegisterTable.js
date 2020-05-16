/*
 * @author: 王志鹏
 * @Datetime  2020/2/20 8:58
 */
import React, { Component } from 'react'
import { router } from 'umi'
import { Button, DatePicker, Form, Input, Select, Upload, notification, Icon } from 'antd'
import moment from 'moment'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'
import styles from '@/pages/文件上传/Index.less'
import ArchivesInput from '@/pages/文件上传/common/ArchivesInput'

const { Option } = Select

class RegisterTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      clueList: [
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
      ],
      source: [
        '信访举报',
        '上级交办',
        '公检法机关移交',
        '监督检查中发现',
        '审查调查中发现',
        '审计中发现',
        '巡视巡查中发现',
        '其他行政执法机关移交',
        '其他'
      ],
      secondList: [],
      fenLeiList: [{}]
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
  }

  componentDidMount() {
    if (this.id !== undefined) {
      this.fetch()
    }
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      res.data.form.wenTiXianSuo_shouDaoShiJian = res.data.form.wenTiXianSuo_shouDaoShiJian ? moment(res.data.form.wenTiXianSuo_shouDaoShiJian) : null
      res.data.form.wenTiXianSuo_beiFanYingRenRuDangShiJian = res.data.form.wenTiXianSuo_beiFanYingRenRuDangShiJian
        ? moment(res.data.form.wenTiXianSuo_beiFanYingRenRuDangShiJian)
        : null
      res.data.form.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian = res.data.form.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian
        ? moment(res.data.form.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian)
        : null
      res.data.form.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian = res.data.form.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian
        ? moment(res.data.form.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian)
        : null
      res.data.form.wenTiXianSuo_beiFanYingRenBorn = res.data.form.wenTiXianSuo_beiFanYingRenBorn
        ? moment(res.data.form.wenTiXianSuo_beiFanYingRenBorn)
        : null
      res.data.form.wenTiXianSuo_xianSuoLaiYuan =
        typeof res.data.form.wenTiXianSuo_xianSuoLaiYuan === 'string' ? res.data.form.wenTiXianSuo_xianSuoLaiYuan.split(';') : null
      this.setState({
        dataSource: res.data.form,
        data: res.data,
        fenLeiList: res.data.form.fenLeiList
      })
      this.props.form.setFieldsValue(res.data.form)
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey

    this.props.form.validateFields((err, values) => {
      if (err) return false
      values.wenTiXianSuo_dengJiTime = new Date()
      values.wenTiXianSuo_status = '未登记'
      // wenTiXianSuo_biaoZhi、shenChaDiaoCha_status 调试使用  后期删除
      // values.wenTiXianSuo_biaoZhi = '立案审查'
      // values.shenChaDiaoCha_status = '未登记'
      //   status 调试结束需改回问题线索

      values.wenTiXianSuo_xianSuoLaiYuan = values.wenTiXianSuo_xianSuoLaiYuan.join(';')

      values.status = '问题线索' //问题线索
      values.flow_path = '问题线索'
      values.wenTiXianSuo_files = this.fileRef.state.fileList
      values.anJuan.chengXu = []
      values.anJuan.zhuTi = []
      values.anJuan.caiLiao = []
      // console.log(values)
      // 开始流程接口
      post(`activiti/startProcess?processDefinitionKey=${processDefinitionKey}`, { ...values }).then(res => {
        const taskid = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        //完成任务
        post(`activiti/completeTask?taskId=${taskid}`, values).then(res => {
          notification.success({ message: '提交成功' })
          router.goBack()
          sessionStorage.setItem('locked', JSON.stringify(true))
        })
      })
    })
  }

  updateSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      values.wenTiXianSuo_upDateTime = new Date()
      const arr = []
      if (typeof values.wenTiXianSuo_xianSuoLaiYuan === 'string') {
        // arr.push(values.wenTiXianSuo_xianSuoLaiYuan)
        values.wenTiXianSuo_xianSuoLaiYuan = values.wenTiXianSuo_xianSuoLaiYuan
      } else {
        values.wenTiXianSuo_xianSuoLaiYuan = values.wenTiXianSuo_xianSuoLaiYuan.join(';')
      }
      // console.log(values.wenTiXianSuo_xianSuoLaiYuan)
      // values.wenTiXianSuo_xianSuoLaiYuan = values.wenTiXianSuo_xianSuoLaiYuan ? values.wenTiXianSuo_xianSuoLaiYuan.join(';') : null
      values.wenTiXianSuo_status = '未登记'
      values.status = '问题线索' //问题线索
      values.flow_path = '问题线索'
      values.wenTiXianSuo_files = this.fileRef.state.fileList
      values.anJuan.chengXu = []
      values.anJuan.zhuTi = []
      values.anJuan.caiLiao = []
      const taskId = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      post(`activiti/setProcessVariables/${this.id}`, { ...values }).then(res => {
        router.goBack()
        notification.success({ message: '提交成功' })
      })
    })
  }

  changeSecondList = e => {
    // fenLeiList[${index}].wenTiXianSuo_wenTiErJiFenLei
    // this.props.form.setFieldsValue({ fenLeiList: [] })
    const { secondList } = this.state
    for (let item of this.state.clueList) {
      if (item.name === e) {
        secondList.push(item.children)
        this.setState({
          secondList
        })
      }
    }
  }

  remove = index => {
    const { form } = this.props
    const { secondList } = this.state
    // can use data-binding to get
    const keys = form.getFieldValue('fenLeiList')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }
    keys.splice(index, 1)
    secondList.splice(index, 1)
    // console.log(secondList,340)
    this.setState({
      fenLeiList: keys,
      secondList
    })
    form.setFieldsValue({
      fenLeiList: keys
    })
  }

  add = () => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('fenLeiList')
    // console.log(keys)
    keys.push({ startTime: undefined, endTime: undefined, unit: undefined, post: undefined })
    // can use data-binding to set
    // important! notify form to detect changes
    // console.log(nextKeys)
    this.setState({
      fenLeiList: keys
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { dataSource, fenLeiList, secondList } = this.state
    const formItems = fenLeiList.map((item, index) => (
      <div style={{ display: 'flex', marginTop: 20, alignItems: 'center' }}>
        <TableInput data={dataSource.wenTiXianSuo_wenTiLeiXing}>
          <Form.Item style={{ display: 'flex', marginRight: 10 }} label='检索反映问题类型'>
            {getFieldDecorator(`fenLeiList[${index}].wenTiXianSuo_wenTiLeiXing`, {
              rules: [{ required: true, message: '必填!' }]
            })(
              <Select
                style={{ width: 120 }}
                allowClear
                onChange={e => {
                  this.changeSecondList(e, index)
                }}
              >
                {this.state.clueList.map((itemList, i) => {
                  return (
                    <Option key={i} value={itemList.id}>
                      {itemList.name}
                    </Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>
        </TableInput>
        <TableInput data={dataSource.wenTiXianSuo_wenTiErJiFenLei}>
          <Form.Item style={{ display: 'flex' }} label='线索反映问题二级'>
            {getFieldDecorator(`fenLeiList[${index}].wenTiXianSuo_wenTiErJiFenLei`)(
              <Select style={{ width: 410 }} allowClear disabled={secondList[index] && this.state.secondList[index].length === 0}>
                {this.state.secondList[index] &&
                  this.state.secondList[index].map((itemList, i) => {
                    return (
                      <Option key={i} value={itemList.id}>
                        {itemList.name}
                      </Option>
                    )
                  })}
              </Select>
            )}
          </Form.Item>
        </TableInput>
        {fenLeiList.length > 1 && this.mode !== 'show' ? (
          <div style={{ verticalAlign: 'middle', border: 'none', textAlign: 'left', width: 18 }}>
            <Icon className='dynamic-delete-button' type='minus-circle-o' onClick={() => this.remove(index)} />
          </div>
        ) : null}
        {fenLeiList.length === index + 1 && this.mode !== 'show' ? (
          <div style={{ verticalAlign: 'middle', border: 'none', textAlign: 'left' }}>
            <Icon style={{ color: 'green' }} className='dynamic-delete-button' type='plus-circle-o' onClick={() => this.add(index)} />
          </div>
        ) : null}
      </div>
    ))
    console.log(dataSource.wenTiXianSuo_files)

    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>中共内蒙古自治区农村信用社联合社</p>
          <p className={style.title}>问题线索登记表</p>

          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>线索来源</td>
                  <td className={style.val} colSpan={7}>
                    <TableInput data={dataSource.wenTiXianSuo_xianSuoLaiYuan}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_xianSuoLaiYuan', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }} mode='multiple'>
                            {this.state.source.map((item, index) => {
                              return (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              )
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映人</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_fanYingRen}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_fanYingRen', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_fanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_fanYingRenDanWei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_fanYingRenZhiWu}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_fanYingRenZhiWu', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>性别</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_xingBie}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_xingBie', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select>
                            <Option value='男'>男</Option>
                            <Option value='女'>女</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>政治面貌</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_zhengZhiMianMao}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_zhengZhiMianMao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>联系电话</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_dianHua}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_dianHua', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input size='large' placeholder='' allowClear={false} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>通信地址</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_diZhi}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_diZhi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input size='large' placeholder='' allowClear={false} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRen}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRen', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenDanWei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenZhiWu', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>政治面貌</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenZhengZhiMianMao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>年龄</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenNianLing}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenNianLing', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>性别</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenXingBie}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenXingBie', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select>
                            <Option value='男'>男</Option>
                            <Option value='女'>女</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>民族</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenMinZu}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenMinZu', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>是否人大代表/政协委员</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select>
                            <Option value='是'>是</Option>
                            <Option value='否'>否</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>出生年月</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      data={dataSource.wenTiXianSuo_beiFanYingRenBorn ? moment(dataSource.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD') : ''}
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenBorn', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>入党时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenRuDangShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>收到时间</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput
                      data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_shouDaoShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>参加工作时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>任现职时间</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenRenXianZhiShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>内容摘要</td>
                  <td className={style.val} colSpan={7}>
                    <TableInput data={dataSource.wenTiXianSuo_neiRongZhaiYao}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_neiRongZhaiYao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映主要问题</td>
                  <td className={style.val} colSpan={7}>
                    <TableInput data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_fanYingZhuYaoWenTi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
            {formItems}
            <DisplayControlComponent>
              <div style={{ textAlign: 'left' }}>
                <UploadComp
                  key={dataSource.wenTiXianSuo_xuHao || 0}
                  fileList={dataSource.wenTiXianSuo_files || []}
                  ref={ref => {
                    this.fileRef = ref
                  }}
                />
              </div>
            </DisplayControlComponent>
            <div>
              <TableInput data={dataSource.anJuan ? dataSource.anJuan : ''}>
                <Form.Item style={{ display: 'flex' }} label='案卷提名：'>
                  {getFieldDecorator('anJuan.name', {
                    rules: [{ required: true, message: '必填!' }]
                  })(<Input style={{ width: 200, marginBottom: 20 }} />)}
                </Form.Item>
              </TableInput>
            </div>
          </Form>
          <Button style={{ marginRight: 20 }} onClick={() => router.goBack()}>
            返回
          </Button>
          <Button type='primary' onClick={this.type === 'edit' ? this.updateSubmit : this.submit}>
            提交保存
          </Button>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(RegisterTable)
export default wapper
