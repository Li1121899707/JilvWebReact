import React, { Component } from 'react'
import { Button, Form, Input, notification, Select, Timeline, Upload } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import { exportFiles } from '@/utils/common'

const { Option } = Select

class waiChaGongZuoDetailTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      dataSource: {},
      leaderList: [],
      leaderOption_shenChaDiaoCha_waicha: [],
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
    this.num = this.props.match.params.num
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task
      for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
        if (!res.data.historicUserTaskInstanceList[i].ended) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState({
        data: res.data.form,
        dataSource: res.data.form.shenChaDiaoCha_countWaiChaYiJian[this.num],
        leaderOption_shenChaDiaoCha_waicha: res.data.form.shenChaDiaoCha_countWaiChaYiJian[this.num].shenChaDiaoCha_waiChaYiJian
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    const { leaderList, dataSource, data } = this.state
    console.log(dataSource)
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box_LiAn}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>外查工作方案呈批表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                  <td className={styles.label}>线索编号</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_xuHao} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被反映人姓名</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRen} />
                  </td>
                  <td className={styles.label}>单位</td>
                  <td className={styles.val} colSpan={3}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenDanWei} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>性别</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenXingBie} />
                  </td>
                  <td className={styles.label}>职务</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenZhiWu} />
                  </td>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenZhengZhiMianMao} />
                  </td>
                  <td className={styles.label}>民族</td>
                  <td className={styles.val}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_beiFanYingRenMinZu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>立案依据</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={data.shenChaDiaoCha_liAnYiJu} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>审查阶段需查明的问题</td>
                  <td className={styles.val} colSpan={7}>
                    <TableInput propsMode='show' data={data.shenChaDiaoCha_shenChaFangAn_wenTi} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>承办室意见</td>
                  <td className={styles.val} colSpan={7}>
                    <Timeline mode='left'>
                      {this.state.leaderOption_shenChaDiaoCha_waicha.map((item, index) => (
                        <Timeline.Item key={index} style={{ textAlign: 'left' }}>
                          <div>
                            {item.name} {item.time}
                          </div>
                          <div className={styles.bold}>{item.type}：</div>
                          <div>{item.advise}</div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </td>
                </tr>
              </tbody>
            </table>
            <p style={{ textAlign: 'left' }}>
              相关附件:
              {dataSource.shenChaDiaoCha_waiChaGongZuo_files &&
                dataSource.shenChaDiaoCha_waiChaGongZuo_files.map(item => (
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
          </Form>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(waiChaGongZuoDetailTable)
export default wapper
