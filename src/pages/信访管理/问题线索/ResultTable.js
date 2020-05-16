/**
 * @Author 王舒宁
 * @Date 2020/3/17 11:13
 **/

import React, { Component } from 'react'
import { Button, DatePicker, Form, Input, Select, Timeline, notification } from 'antd'
import moment from 'moment'
import { router, Link } from 'umi'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import { get, post } from '@/utils/http'
import ProcessDefinitionKey from '../common/aboutActiviti'
import DisplayControlComponent from '@/pages/信访管理/common/DisplayControlComponent'

const { Option } = Select

class ResultTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {}
    }
    this.id = this.props.match.params.id
    this.type = this.props.match.params.type
  }

  componentDidMount() {
    // this.fetch()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { dataSource, leaderList } = this.state
    return (
      <div className={styles.content}>
        <div className={styles.content_box}>
          <p className={styles.title}>内蒙古自治区纪委监委驻自治区农信联社纪检监察组</p>
          <p className={styles.title}>问题线索结果登记表</p>
          <Form>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.label}>线索来源</td>
                  <td className={styles.val} width={700}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_xianSuoLaiYuan}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_xianSuoLaiYuan', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>收件日期</td>
                  <td className={styles.val}>
                    <TableInput
                      propsMode='add'
                      data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
                    >
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_shouDaoShiJian', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<DatePicker style={{ width: 700 }} />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>

                <tr>
                  <td className={styles.label}>政治面貌</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_zhengZhiMianMao}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_zhengZhiMianMao', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位及职务</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_fanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_fanYingRenDanWei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>被反映人</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_beiFanYingRen}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRen', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>工作单位及职务</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenDanWei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>反映主要问题</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_fanYingZhuYaoWenTi', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea style={{ minHeight: 200 }} placeholder='' size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>处置过程</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenDanWei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>处置结果</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_beiFanYingRenDanWei', {
                          rules: [{ required: true, message: '必填!' }]
                        })(<Input.TextArea size='large' allowClear />)}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>四种形态归类</td>
                  <td className={styles.val}>
                    <TableInput propsMode='add' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei}>
                      <Form.Item>
                        {getFieldDecorator('wenTiXianSuo_siZhongXingTai', {
                          rules: [{ required: true, message: '必填!' }]
                        })(
                          <Select size='large' allowClear>
                            <Option value='1'>第一种形态</Option>
                            <Option value='2'>第二种形态</Option>
                            <Option value='3'>第三种形态</Option>
                            <Option value='4'>第四种形态</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </TableInput>
                  </td>
                </tr>
              </tbody>
            </table>
          </Form>
          <div />
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: 20, marginTop: 20 }} onClick={() => router.goBack()}>
              返回
            </Button>
            <DisplayControlComponent>
              <Button type='primary' onClick={this.submit}>
                提交
              </Button>
            </DisplayControlComponent>
          </div>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(ResultTable)
export default wapper
