import React, { Component } from 'react'
import { Button, Form, Input, Select, notification, Divider, DatePicker, Tabs, Timeline } from 'antd'
import { Link, router } from 'umi'
import moment from 'moment'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'

const { Option } = Select
const { TabPane } = Tabs

class ScheduleTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leader: '',
      data: [],
      leaderOption_wenTiXianSUO: [],
      leaderOption_tanHuaHanXun: [],
      sourceList: [
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
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState(
        {
          dataSource: res.data.form,
          data: res.data,
          leaderOption_wenTiXianSUO: res.data.form.wenTiXianSuo_niBanYiJian ? res.data.form.wenTiXianSuo_niBanYiJian : [],
          leaderOption_tanHuaHanXun: res.data.form.tanHuaHanXun_yiJian ? res.data.form.tanHuaHanXun_yiJian : []
        },
        this.huoquhouxunaren
      )
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList, leaderOption_wenTiXianSUO, leaderOption_tanHuaHanXun } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))

    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>中共内蒙古自治区农村信用社联合社检查委员会</p>
          <p className={styles.title}>谈话函询处置意见</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>收件日期</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='show'
                      data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
                    />
                  </td>
                  <td className={styles.label}>反应人</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRen} />
                  </td>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xingBie} />
                  </td>
                </tr>

                <tr>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_zhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>联系电话</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_dianHua} />
                  </td>
                  <td className={styles.label}>通信地址</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_diZhi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenDanWei} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被反映人</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位</td>
                  <td className={styles.val} colSpan={2}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>反应主要问题</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>月度办理情况说明</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={dataSource.yueDuBanLiQingKuang} />
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>

          <div className={styles.submitDiv} style={{ textAlign: 'center' }}>
            <div className={styles.submitDiv}>
              <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(ScheduleTable)
export default wapper
