import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, Timeline, Tabs, Select } from 'antd'
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
      leaderOption_tanHuaHanXun: []
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      console.log(res.data.form.wenTiXianSuo_niBanYiJian)
      this.setState({
        dataSource: res.data.form,
        leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
        leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_niBanYiJian ? res.data.form.tanHuaHanXun_niBanYiJian : []
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderOption_wenTiXianSUO } = this.state

    return (
      <div className={style.content}>
        <div className={style.content_box}>
          <p className={style.title}>中共内蒙古自治区农村信用社联合社检查委员会</p>
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
                <tr>
                  <td className={style.label}>拟办方式</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_chuLiFangShi} />
                  </td>
                  <td className={style.label}>转办/交办/督办/协调单位</td>
                  <td className={style.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_chuLiFangShi_buMen} />
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>处置方式</td>
                  <td className={style.val} colSpan={5}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_chuZhiFangShi}>
                      {dataSource.wenTiXianSuo_chuZhiFangShi}
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={style.label}>拟办/审批意见</td>
                  <td className={style.val} colSpan={7}>
                    <Timeline mode='left'>
                      {leaderOption_wenTiXianSUO.map((item, index) => (
                        <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                          <div>
                            {item.name} {item.time}
                          </div>
                          <div className={style.bold}>{item.type}：</div>
                          <div>{item.advise}</div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
          <p style={{ textAlign: 'left' }}>
            相关附件:
            {dataSource.wenTiXianSuo_files &&
              dataSource.wenTiXianSuo_files.map(item => (
                <a target='_blank' href={
                  exportFiles(`${window.server}/api/files/${item.response.path}`, item.response.path)
                  }>
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
