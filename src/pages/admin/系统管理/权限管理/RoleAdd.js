/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Select, Radio, Form, message, notification } from 'antd'
import router from 'umi/router'
import { connect } from 'dva'
import { get, post, put } from '@/utils/http'
import styles from './Role.less'

const { TextArea } = Input
const { Option } = Select

class RoleAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
    this.pageType = this.props.match.params.id ? 'edit' : 'add' // 判断页面是编辑还是新增
  }

  componentDidMount() {
    if (this.pageType === 'edit') this.getDetail()
  }

  getDetail = () => {
    get(`sys-roles/${this.props.match.params.id}`).then(res => {
      this.setState({ data: res.data })
    })
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      if (this.pageType === 'edit') {
        const id = this.props.match.params.id
        const newParams = { id, ...values }
        put('sys-roles', newParams).then(res => {
          notification.success({ message: '修改成功' })
          this.props.history.go(-1)
        })
      } else {
        const newParams = { ...values }
        post('sys-roles', newParams).then(res => {
          notification.success({ message: '新增成功' })
          this.props.history.go(-1)
        })
      }
    })
  }

  handleClose = () => {
    this.props.dispatch({
      type: 'routerTabs/closePage',
      payload: { closePath: this.props.location.pathname }
    })
    router.goBack()
  }

  render() {
    const { data } = this.state
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
          <span className={styles.tit}>角色{this.pageType === 'edit' ? '编辑' : '新增'}</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='角色名称'>
                  {getFieldDecorator('roleName', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.roleName
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='角色编码'>
                  {getFieldDecorator('roleCode', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.roleCode
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='排序号'>
                  {getFieldDecorator('roleSort', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.roleSort
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='角色类型'>
                  {getFieldDecorator('roleType', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.roleType
                  })(
                    <Select allowClear>
                      <Option value='USER'>员工</Option>
                      <Option value='ORGANIZARION'>组织</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='系统内置'>
                  {getFieldDecorator('isSys', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.isSys
                  })(
                    <Radio.Group>
                      <Radio value>是</Radio>
                      <Radio value={false}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='状态'>
                  {getFieldDecorator('status', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.status
                  })(
                    <Select allowClear>
                      <Option value='NORMAL'>正常</Option>
                      <Option value='DISABLE' style={{ color: 'red' }}>
                        停用
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={1}>
                <Form.Item label='备注信息' wrapperCol={{ span: 19 }} labelCol={{ span: 3 }}>
                  {getFieldDecorator('remarks', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ],
                    initialValue: data.remarks
                  })(<TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* <Button className={styles.addtit} type='link'> */}
          {/*  授权功能菜单 */}
          {/* </Button> */}
          {/* <Divider /> */}
          {/* <div> */}
          {/*  <Button type='link' className={styles.addtit}> */}
          {/*    展开 */}
          {/*  </Button> */}
          {/*  / */}
          {/*  <Button type='link' className={styles.addtit}> */}
          {/*    折叠 */}
          {/*  </Button> */}
          {/*  <TreeMenu /> */}
          {/* </div> */}

          <Button type='primary' style={{ marginLeft: 190, marginTop: 15 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 10, marginTop: 15 }} onClick={this.handleClose}>
            返回
          </Button>
        </div>
      </div>
    )
  }
}

export default connect()(Form.create()(RoleAdd))
