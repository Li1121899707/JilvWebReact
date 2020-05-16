/*
 * @author: 王志鹏
 * @Datetime  2020/2/19 17:05
 */

import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, Timeline, Tabs, Select, Icon } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import style from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get } from '@/utils/http'
import { exportFiles } from '@/utils/common'

const { TabPane } = Tabs
const { Option } = Select

class RegisterTableDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderOption_wenTiXianSUO: [],
      fenLeiList: [],
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
      secondList: []
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        dataSource: res.data.form,
        fenLeiList: res.data.form.fenLeiList,
        leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : []
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, fenLeiList, secondList, leaderOption_wenTiXianSUO } = this.state
    const formItems = fenLeiList.map((item, index) => (
      <tr>
        <td className={style.label}>检索反映问题类型:</td>
        <td className={style.val} colSpan={2}>
          {item.wenTiXianSuo_wenTiLeiXing}
        </td>
        <td className={style.label}>线索反映问题二级</td>
        <td className={style.val} colSpan={2}>
          {item.wenTiXianSuo_wenTiErJiFenLei}
        </td>
      </tr>
    ))

    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={style.title}>问题线索登记表</p>
          <p style={{ paddingLeft: '35%' }}>处理单序号：{dataSource.wenTiXianSuo_xuHao}</p>
          <Form>
            <table className={style.table}>
              <tbody>
                <tr>
                  <td className={style.label}>线索来源</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>反映人</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRen} />
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>被反映人</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={style.label}>单位</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={style.label}>职务</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>政治面貌</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={style.label}>年龄</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenNianLing} />
                  </td>
                  <td className={style.label}>性别</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>民族</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                  <td className={style.label}>是否人大代表/政协委员</td>
                  <td className={style.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenIsRenDaDaiBiao} />
                  </td>
                  <td className={style.label}>出生年月</td>
                  <td className={style.val}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_beiFanYingRenBorn ? moment(dataSource.wenTiXianSuo_beiFanYingRenBorn).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>入党时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRuDangShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                  <td className={style.label}>收到时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>参加工作时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenCanJiaGongZuoShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                  <td className={style.label}>任现职时间</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian
                          ? moment(dataSource.wenTiXianSuo_beiFanYingRenRenXianZhiShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>内容摘要</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_neiRongZhaiYao} />
                  </td>
                </tr>
                {formItems}
              </tbody>
            </table>
          </Form>
          <p style={{ textAlign: 'left' }}>
            相关附件:
            {dataSource.wenTiXianSuo_files &&
              dataSource.wenTiXianSuo_files.map(item => (
                <a
                  target='_blank'
                  onClick={() => {
                    exportFiles(`${window.server}/api/files/${item.response.path}`, item.response.path)
                  }}
                >
                  {item.response.fileName}&emsp;
                </a>
              ))}
          </p>

          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
              返回
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(RegisterTableDetail)
export default wapper
