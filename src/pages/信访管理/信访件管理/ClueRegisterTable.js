import React, { Component } from 'react'
import { router } from 'umi'
import { Button, DatePicker, Form, Input, Select, Upload, notification } from 'antd'
import moment from 'moment'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post, put } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'
import UploadComp from '@/components/upload/Upload'

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
      secondList: []
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
    this.fanYingRen = ['自治区联社机关干部', '基层行社一把手', '基层行社其他班子成员', '基层行社环节干部', '基层行社其他人员', '单位']
    this.laiXin = [
      '呼和浩特市',
      '赤峰市',
      '呼伦贝尔市',
      '兴安盟',
      '通辽市',
      '乌兰察布市',
      '锡林郭勒盟',
      '包头市',
      '巴彦淖尔市',
      '阿拉善盟',
      '鄂尔多斯市',
      '乌海市'
    ]
    this.contextType = [
      `违规发放贷款以贷谋私`,
      '违规招录和提拔人员',
      '经商办企业',
      '违规基建',
      '违规装修房屋',
      '大宗物品采购',
      '工作作风问题',
      '诉求类',
      '其他违反八项规定精神的问题'
    ]
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`petitions/${this.id}`).then(res => {
      res.data.attachment = JSON.parse(res.data.attachment)
      res.data.recieveTime = res.data.recieveTime ? moment(res.data.recieveTime) : ''
      this.props.form.setFieldsValue(res.data)
      this.setState({
        dataSource: res.data
      })
    })
  }

  submit = () => {
    let processDefinitionKey = ProcessDefinitionKey
    let val = {}
    this.props.form.validateFields((err, values) => {
      if (err) return false
      val.wenTiXianSuo_dengJiTime = new Date()
      val.wenTiXianSuo_status = '未登记'
      val.status = '问题线索' //问题线索
      val.flow_path = '问题线索'
      val.wenTiXianSuo_files = this.fileRef.state.fileList
      val.wenTiXianSuo_xianSuoLaiYuan = values.source
      val.wenTiXianSuo_fanYingRen = values.reporter
      val.wenTiXianSuo_fanYingRenDanWei = values.reporterUnit
      val.wenTiXianSuo_fanYingRenZhiWu = values.reporterPost
      val.wenTiXianSuo_beiFanYingRen = values.informee
      val.wenTiXianSuo_beiFanYingRenDanWei = values.informeeUnit
      val.wenTiXianSuo_beiFanYingRenZhiWu = values.informeePost
      val.wenTiXianSuo_shouDaoShiJian = values.recieveTime
      val.wenTiXianSuo_neiRongZhaiYao = values.content
      val.wenTiXianSuo_fanYingZhuYaoWenTi = values.wenTiXianSuo_fanYingZhuYaoWenTi
      val.wenTiXianSuo_zhengZhiMianMao = values.wenTiXianSuo_zhengZhiMianMao
      val.wenTiXianSuo_dianHua = values.wenTiXianSuo_dianHua
      val.wenTiXianSuo_diZhi = values.wenTiXianSuo_diZhi
      val.wenTiXianSuo_wenTiLeiXing = values.wenTiXianSuo_wenTiLeiXing
      val.wenTiXianSuo_wenTiErJiFenLei = values.wenTiXianSuo_wenTiErJiFenLei
      val.wenTiXianSuo_sourceCity = values.sourceCity
      val.resultClass = values.resultClass
      val.contentClass = values.contentClass
      val.wenTiXianSuo_beiFanYingRenZhengZhiMianMao = values.wenTiXianSuo_beiFanYingRenZhengZhiMianMao
      val.wenTiXianSuo_beiFanYingRenNianLing = values.wenTiXianSuo_beiFanYingRenNianLing
      val.wenTiXianSuo_beiFanYingRenXingBie = values.wenTiXianSuo_beiFanYingRenXingBie
      val.wenTiXianSuo_beiFanYingRenMinZu = values.wenTiXianSuo_beiFanYingRenMinZu
      val.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao = values.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao
      val.wenTiXianSuo_beiFanYingRenBorn = values.wenTiXianSuo_beiFanYingRenBorn
      val.wenTiXianSuo_beiFanYingRenRuDangShiJian = values.wenTiXianSuo_beiFanYingRenRuDangShiJian
      val.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian = values.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian
      val.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian = values.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian
      console.log(values.source)
      if (typeof values.source === 'string') {
        values.wenTiXianSuo_xianSuoLaiYuan = values.source
      } else {
        values.wenTiXianSuo_xianSuoLaiYuan = values.source.join(';')
      }
      const anJuan = {}
      anJuan.name = values.anJuanTiMing
      val.anJuan = anJuan
      val.isXinFang = true
      // 开始流程接口
      post(`activiti/startProcess?processDefinitionKey=${processDefinitionKey}`).then(res => {
        const taskid = res.data.historicUserTaskInstanceList[res.data.historicUserTaskInstanceList.length - 1].taskInstanceId
        const processInstanceId = res.data.processInstanceId
        //完成任务
        post(`activiti/completeTask?taskId=${taskid}`, val).then(res => {
          let valId = {
            petitionId: this.id,
            processInstanceId
          }
          put(`petitions/mergeToClue`, { ...valId }).then(res => {})
          notification.success({ message: '提交成功' })
          router.goBack()
        })
      })
    })
  }

  updateSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      values.wenTiXianSuo_upDateTime = new Date()
      values.wenTiXianSuo_status = '未登记'
      values.status = '问题线索' //问题线索
      values.flow_path = '问题线索'
      values.wenTiXianSuo_files = this.fileRef.state.fileList
      const taskId = this.state.data.historicUserTaskInstanceList[this.state.data.historicUserTaskInstanceList.length - 1].taskInstanceId
      post(`activiti/setProcessVariables/${this.id}`, { ...values }).then(res => {
        notification.success({ message: '提交成功' })
        router.goBack()
      })
    })
  }

  changeSecondList = e => {
    this.props.form.setFieldsValue({ wenTiXianSuo_wenTiErJiFenLei: '' })
    for (let item of this.state.clueList) {
      if (item.name === e) {
        this.setState({
          secondList: item.children
        })
      }
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { dataSource, leaderList } = this.state

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
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.source}>
                      <Form.Item>
                        {getFieldDecorator('source', {
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
                    <TableInput data={dataSource.reporter}>
                      <Form.Item>
                        {getFieldDecorator('reporter', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.reporterUnit}>
                      <Form.Item>
                        {getFieldDecorator('reporterUnit', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.reporterPost}>
                      <Form.Item>
                        {getFieldDecorator('reporterPost', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
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
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_dianHua}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_dianHua', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input size='large' placeholder='' allowClear={false} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>通信地址</td>
                  <td className={style.val}>
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
                    <TableInput data={dataSource.informee}>
                      <Form.Item>
                        {getFieldDecorator('informee', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.informeeUnit}>
                      <Form.Item>
                        {getFieldDecorator('informeeUnit', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput data={dataSource.informeePost}>
                      <Form.Item>
                        {getFieldDecorator('informeePost', {
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
                  <td className={style.val}>
                    <TableInput data={dataSource.wenTiXianSuo_beiFanYingRenNianLing}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenNianLing', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>性别</td>
                  <td className={style.val}>
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
                  <td className={style.val}>
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
                  <td className={style.val}>
                    <TableInput
                      data={dataSource.wenTiXianSuo_beiFanYingRenBorn ? moment(dataSource.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD') : ''}
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenBorn', {
                          rules: [{ required: true, message: '必填!' }],
                          initialValue: this.state.wenTiXianSuo_beiFanYingRenBorn
                            ? moment(moment(this.state.dataSource.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD'), 'YYYY/MM/DD')
                            : ''
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
                          rules: [{ required: true, message: '必填!' }],
                          initialValue: this.state.dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian
                            ? moment(moment(this.state.dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian).format('YYYY-MM-DD'), 'YYYY/MM/DD')
                            : ''
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>收到时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput data={dataSource.recieveTime ? moment(dataSource.recieveTime).format('YYYY-MM-DD') : ''}>
                      <Form.Item>
                        {getFieldDecorator('recieveTime', {
                          rules: [{ required: true, message: '必填!' }],
                          initialValue: this.state.dataSource.recieveTime
                            ? moment(moment(this.state.dataSource.recieveTime).format('YYYY-MM-DD'), 'YYYY/MM/DD')
                            : ''
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
                          rules: [{ required: true, message: '必填!' }],
                          initialValue: this.state.dataSource.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian
                            ? moment(moment(this.state.dataSource.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian).format('YYYY-MM-DD'), 'YYYY/MM/DD')
                            : ''
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                  <td className={style.label}>任现职时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenRenXianZhiShiJian', {
                          rules: [{ required: true, message: '必填!' }],
                          initialValue: this.state.dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian
                            ? moment(moment(this.state.dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian).format('YYYY-MM-DD'), 'YYYY/MM/DD')
                            : ''
                        })(<DatePicker style={{ width: '100%' }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人分类</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.informeeClass}>
                      <Form.Item>
                        {getFieldDecorator('informeeClass', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.fanYingRen.map((item, index) => {
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
                  <td className={style.label}>反映问题类型</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.contentClass}>
                      <Form.Item>
                        {getFieldDecorator('contentClass', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.contextType.map((item, index) => {
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
                  <td className={style.label}>信访件来源（地区）</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.sourceCity}>
                      <Form.Item>
                        {getFieldDecorator('sourceCity', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select style={{ width: '100%' }}>
                            {this.laiXin.map((item, index) => {
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
                {/*<tr>*/}
                {/*  <td className={style.label}>收到时间</td>*/}
                {/*  <td className={style.val} colSpan={5}>*/}
                {/*    <TableInput data={dataSource.recieveTime}>*/}
                {/*      <Form.Item>{getFieldDecorator('recieveTime')(<DatePicker style={{ width: '100%' }} />)}</Form.Item>*/}
                {/*    </TableInput>*/}
                {/*  </td>*/}
                {/*</tr>*/}
                <tr>
                  <td className={style.label}>内容摘要</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput data={dataSource.content}>
                      <Form.Item>
                        {getFieldDecorator('content', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映主要问题</td>
                  <td className={style.val} colSpan={5}>
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
            <div style={{ display: 'flex', marginTop: 20 }}>
              <TableInput data={dataSource.wenTiXianSuo_wenTiLeiXing}>
                <Form.Item style={{ display: 'flex', marginRight: 10 }} label='检索反映问题类型'>
                  {getFieldDecorator('wenTiXianSuo_wenTiLeiXing', {
                    rules: [{ required: true, message: '必填!' }]
                  })(
                    <Select
                      style={{ width: 120 }}
                      allowClear
                      onChange={e => {
                        this.changeSecondList(e)
                      }}
                    >
                      {this.state.clueList.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </Form.Item>
              </TableInput>
              <TableInput data={dataSource.wenTiXianSuo_wenTiErJiFenLei}>
                <Form.Item style={{ display: 'flex' }} label='线索反映问题二级'>
                  {getFieldDecorator('wenTiXianSuo_wenTiErJiFenLei')(
                    <Select style={{ width: 410 }} allowClear disabled={this.state.secondList.length === 0}>
                      {this.state.secondList.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.name}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </Form.Item>
              </TableInput>
            </div>
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
              <TableInput data={dataSource.wenTiXianSuo_chuLiFangShi_neiRong}>
                <Form.Item style={{ display: 'flex' }} label='案卷提名：'>
                  {getFieldDecorator('anJuanTiMing', {
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
