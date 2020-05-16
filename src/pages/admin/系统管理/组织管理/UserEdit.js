/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button, Col, Divider, Input, Row, Form, Icon, Table, Modal, message, notification } from 'antd'
import router from 'umi/router'
import { put, get } from '@/utils/http'
import styles from './User.less'
import OrgTreeSelect from '@/components/OrgTreeSelect'
// import CompanyTreeSelect from '@/components/CompanyTreeSelect'
import StationSelect from '@/components/StationSelect'

// const { Option } = Select
const { TextArea } = Input

class UserEdit extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      pagination: { current: 0, pageSize: this.PageSize },
      loading: false,
      dataSource: [],
      visible: false,
      data: {},
      selectedRowKeys: []
    }
  }

  componentDidMount() {
    this.getRoleList()
    this.getDetail()
  }

  getDetail = () => {
    get(`sys/user-employee/${this.props.match.params.id}`).then(res => {
      const { data } = res
      const { postInfoList } = data
      let newpostInfoList = []
      postInfoList.forEach(item => {
        newpostInfoList.push(item.id)
      })
      let initVal = { ...data, postInfoList: newpostInfoList, officeInfo: { id: data.officeInfo.id } }
      this.props.form.setFieldsValue(initVal)
      let selectedRowKeysRow = data.userInfo.roleList
      let selectedRowKeys = []
      this.RoleList = selectedRowKeysRow
      selectedRowKeysRow.forEach(item => {
        selectedRowKeys.push(Number(item.id))
      })

      this.setState({ selectedRowKeys })
    })
  }

  getRoleList = (params = {}) => {
    const newParams = { page: 0, size: this.PageSize, ...params }
    get('sys-roles', newParams).then(res => {
      const { pagination } = this.state
      pagination.total = parseInt(res.headers['x-total-count'], 10)
      this.setState({
        loading: false,
        dataSource: res.data,
        pagination
      })
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current - 1
    this.setState({ pagination })
    this.getRoleList({
      page: pager.current,
      ...filters
    })
  }

  handleClose = () => {
    router.push('/admin/system/organ/userlist')
  }

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return false
      const postData = { ...values }
      postData.id = this.props.match.params.id
      // 岗位格式化 【1，2】 =》 【｛id:1｝,{id:2}】
      let { postInfoList } = postData
      let postInfoListArr = []
      if (postInfoList && postInfoList.length) {
        postInfoList.forEach(item => {
          postInfoListArr.push({ id: item })
        })
      }
      postData.postInfoList = postInfoListArr
      postData.userInfo.roleList = this.RoleList
      postData.userInfo.status = 'NORMAL'
      put('sys/user-employees', postData).then(res => {
        notification.success({ message: '修改成功' })
      })
    })
  }

  render() {
    const { data, selectedRowKeys } = this.state
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      selectedRowKeys,
      onChange: (newSelectedRowKeys, selectedRows) => {
        this.RoleList = []
        this.setState({ selectedRowKeys: newSelectedRowKeys })
        selectedRows.forEach(item => {
          this.RoleList.push({ id: item.id, roleCode: item.roleCode, roleName: item.roleName })
        })
      }
    }
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName'
      },
      {
        title: '角色编码',
        dataIndex: 'roleCode'
      }
    ]
    return (
      <div className={styles.contentbox}>
        <div className={styles.header}>
          <span className={styles.tit}>{this.state.title}用户编辑</span>
        </div>
        <div className={styles.middle}>
          <p className={styles.addtit}>基本信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='归属机构'>
                  {getFieldDecorator('officeInfo.id', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<OrgTreeSelect mode='id' />)}
                </Form.Item>
              </Col>
              <Col span={10} />
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='登录账号'>
                  {getFieldDecorator('userInfo.loginCode', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='用户昵称'>
                  {getFieldDecorator('userInfo.userName', {
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
                <Form.Item label='电子邮箱'>
                  {getFieldDecorator('userInfo.email', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input addonAfter={<Icon type='mail' />} allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='手机号码'>
                  {getFieldDecorator('userInfo.mobile', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input addonAfter={<Icon type='mobile' />} allowClear />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='办公电话'>
                  {getFieldDecorator('userInfo.phone', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input addonAfter={<Icon type='phone' />} allowClear />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='权重(排序)：'>
                  {getFieldDecorator('userInfo.userSort', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input placeholder='权值越大排名越靠前，请填写数字' allowClear />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <p className={styles.addtit}>详细信息</p>
          <Divider />
          <Form {...formItemLayout}>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='员工编号'>
                  {getFieldDecorator('empCode', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='员工姓名'>
                  {getFieldDecorator('empName', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={1}>
                <Form.Item label='所在岗位'>
                  {getFieldDecorator('postInfoList', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<StationSelect mode='multiple' />)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label='英文名'>
                  {getFieldDecorator('empNameEn', {
                    rules: [
                      {
                        required: true,
                        message: '必填!'
                      }
                    ]
                  })(<Input />)}
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

          <p className={styles.addtit}>分配角色</p>
          <Divider />
          <Table
            dataSource={this.state.dataSource}
            columns={columns}
            rowKey={record => record.id}
            pagination={this.state.pagination}
            loading={this.state.loading}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
          />

          <Button type='primary' style={{ marginLeft: 160 }} onClick={this.submit}>
            保存
          </Button>
          <Button type='default' style={{ marginLeft: 15 }} onClick={this.handleClose}>
            返回
          </Button>
        </div>

        <Modal title='信息' visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>
            <Icon type='question-circle' style={{ color: '#FFCC00', fontSize: '30px', paddingRight: '10px' }} />
            你确认要删除这条数据吗？
          </p>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(UserEdit)
