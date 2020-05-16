/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Select, Form, Icon, Table, DatePicker, Modal, Radio, Checkbox } from 'antd'
import router from 'umi/router'
import { connect } from 'dva'
import { get } from '@/utils/http'
import styles from './Parameter.less'

const { Option } = Select
const { TextArea, Search } = Input

class ParameterAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: 'block',
      Show: '扩展字段 +'
    }
  }

  componentDidMount() {
    // this.fetch();
  }

  handleShow = () => {
    this.state.Show === '扩展字段 +' ? this.setState({ isShow: 'none', Show: '收起' }) : this.setState({ isShow: 'block', Show: '扩展字段 +' })
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname }
    })
    router.goBack()
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      console.log(values)
    })
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }

    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>新增参数</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='参数名称：'>
                  {getFieldDecorator('csmc', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='参数键名：'>
                  {getFieldDecorator('csjm', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='参数键值：' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('csjz', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='是否系统：'>
                  {getFieldDecorator('sfxt', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='参数描述：' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('csms', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Divider />
          <Button type='primary' style={{ marginLeft: 160 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 15 }} onClick={this.handleClose}>
            关闭
          </Button>
        </div>
      </div>
    )
  }
}
export default connect()(Form.create()(ParameterAdd))
