import React, { Component } from 'react'
import { Button, Form, Input, DatePicker, notification, Select, Timeline } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'

class liAnYanQiDetailTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      leaderList: [],
      leaderOption_shenChaDiaoCha_yanQi: []
    }
    this.id = this.props.match.params.id
    this.num = this.props.match.params.num
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let task = {}
      for (let i = 0; i < res.data.historicUserTaskInstanceList.length; i++) {
        if (!res.data.historicUserTaskInstanceList[i].ended) {
          task = res.data.historicUserTaskInstanceList[i]
          break
        }
      }
      this.setState(
        {
          dataSource: res.data.form.shenChaDiaoCha_countYanQiYiJian[this.num],
          leaderOption_shenChaDiaoCha_yanQi: res.data.form.shenChaDiaoCha_countYanQiYiJian[this.num].shenChaDiaoCha_yanQiYiJian
        },
        this.huoquhouxunaren
      )
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { leaderList, dataSource } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <option key={index} value={item.userCode}>
        {item.userName}
      </option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>
            内蒙古自治区纪委监委驻自治区农信联社纪检监察组
            <br />
            立案审查工作延期申请呈批表
          </p>
          <Form style={{ textAlign: 'center' }}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期事项</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_gongZuoYanQi_shiXiang} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期理由</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_gongZuoYanQi_liYou} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>原要求完成时间</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian
                          ? moment(dataSource.shenChaDiaoCha_gongZuoYanQi_yuanYaoQiuShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期时间</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput
                      propsMode='show'
                      data={
                        dataSource.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian
                          ? moment(dataSource.shenChaDiaoCha_gongZuoYanQi_yanQiShiJian).format('YYYY-MM-DD')
                          : ''
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期单位意见</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <TableInput propsMode='show' data={dataSource.shenChaDiaoCha_gongZuoYanQi_danWeiYiJian} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>意见</td>
                  <td className={styles.val} style={{ width: 721 }}>
                    <Timeline mode='left'>
                      {this.state.leaderOption_shenChaDiaoCha_yanQi.map((item, index) => (
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
          </Form>
          <Button
            style={{ marginRight: 20, marginTop: 20 }}
            onClick={() => {
              router.goBack()
            }}
          >
            返回
          </Button>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(liAnYanQiDetailTable)
export default wapper
