/*
 * @author: 王志鹏
 * @Datetime  2020/3/13 16:35
 */

import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Select, notification, DatePicker, InputNumber, Timeline } from 'antd'
import moment from 'moment'
import { router } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import { get, post, put } from '@/utils/http'
import TableInput from '@/pages/信访管理/common/TableInput'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'

const { Option } = Select

class YanQiShenLi extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      data: {},
      leaderOption_shenLiGuanLi_yanQi: [],
      leaderList: []
    }
    this.id = this.props.match.params.id
    this.num = this.props.match.params.num
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({
        data: res.data.form,
        dataSource: res.data.form.shenLiGuanLi_countYanQiYiJian[this.num],
        leaderOption_shenLiGuanLi_yanQi: res.data.form.shenLiGuanLi_countYanQiYiJian[this.num].shenLiGuanLi_yanQiYiJian
      })
    })
  }

  //获取下一任务候选人接口

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList, data } = this.state
    const leaderListItem = leaderList.map((item, index) => (
      <Option key={index} value={item.userCode}>
        {item.userName}
      </Option>
    ))
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>案件审理工作延期申请呈批表</p>
          <Form>
            <table className={styles.table} style={{ width: 950 }}>
              <tbody>
                <tr>
                  <td className={styles.label} style={{ width: 200 }}>
                    线索来源
                  </td>
                  <td className={styles.val} height={48}>
                    <TableInput propsMode='show' data={data.wenTiXianSuo_xianSuoLaiYuan} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期事项</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_yanQiShenLi_yanQiShiXiang} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>延期理由</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_yanQiShenLi_yanQiLiYou} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>申请延期时间</td>
                  <td className={styles.val} height={50}>
                    <TableInput propsMode='show' data={dataSource.shenLiGuanLi_yanQiShenLi_shenQingShiJian} />
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>意见</td>
                  <td className={styles.val} height={100}>
                    <Timeline mode='left'>
                      {this.state.leaderOption_shenLiGuanLi_yanQi.map((item, index) => (
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
            <div className={styles.submitDiv}>
              <div className={styles.submitDiv}>
                <Button className={styles.submitBtn} onClick={() => router.goBack()}>
                  返回
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(YanQiShenLi)
export default wapper
