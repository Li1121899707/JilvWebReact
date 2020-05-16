/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Form, Button, Divider, Icon, Input, Layout, Table, Checkbox } from 'antd'
// import Link from 'umi/link';
// import router from 'umi/router';
import { get } from '@/utils/http'
import styles from './Online.less'
import ModalOperator from '@/pages/admin/系统管理/系统监控/ModalOperator'
import Breadcrumbs from '@/components/Breadcrumb'

// const { RangePicker } = DatePicker;
const { Search } = Input
// const { Option } = Select;
const { Content } = Layout

class OnlineList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      dataSource: [],
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      isShow: 'block',
      Show: '隐藏',
      visible: false,
      handleModal: false,
      searchValue: ''
    }
  }

  componentDidMount() {
    // this.fetch();
  }

  handleShow = () => {
    this.state.Show === '隐藏' ? this.setState({ isShow: 'none', Show: '查询' }) : this.setState({ isShow: 'block', Show: '隐藏' })
  }

  fetch = (params = {}) => {
    let queryConditions = {}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        queryConditions = values
      }
    })
    this.setState({ loading: true })
    const { pagination } = this.state
    if (Object.keys(params).length === 0 && pagination.current !== 0) {
      pagination.current = 0
      this.setState(pagination)
    }
    const newParams = { size: this.PageSize, ...params, ...queryConditions }
    get('t-customer-changes', newParams).then(res => {
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
    this.fetch({
      page: pager.current,
      ...filters
    })
  }

  handleModal = () => {
    this.setState({
      handleModal: false
    })
  }

  handleValue = n => {
    this.props.form.setFieldsValue({ czyh: n })
    this.setState({
      searchValue: n
    })
  }

  render() {
    const searchValue = this.state.searchValue
    const { getFieldDecorator } = this.props.form
    const { visible } = this.state
    const columns = [
      {
        title: '用户名称',
        dataIndex: 'yhmc'
      },
      {
        title: '创建时间',
        dataIndex: 'cjsj'
      },
      {
        title: '最后访问',
        dataIndex: 'zhfw'
      },
      {
        title: '超时时间',
        dataIndex: 'cssj'
      },
      {
        title: '客户主机',
        dataIndex: 'khzj'
      },
      {
        title: '用户类型',
        dataIndex: 'yhlx'
      },
      {
        title: '设备类型',
        dataIndex: 'sblx'
      },
      {
        title: '操作',
        dataIndex: 'cz'
      }
    ]

    return (
      <>
        <Breadcrumbs />
        <Layout>
          <Content className={styles.contentbox}>
            <div className={styles.header}>
              <span className={styles.tit}>在线用户</span>
              <Button className={styles.addBtn} onClick={this.handleShow}>
                <Icon type='search' />
                {this.state.Show}
              </Button>
            </div>
            <div className={styles.rightDiv}>
              <Form layout='inline' style={{ display: this.state.isShow }}>
                <Form.Item label='操作用户：'>
                  {getFieldDecorator(`czyh`, {})(<Search allowClear onSearch={() => this.setState({ handleModal: true })} />)}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`A`)(
                    <div>
                      <Checkbox.Group>
                        <Checkbox value='A'>查询所有在线</Checkbox>
                      </Checkbox.Group>
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator(`B`)(
                    <div>
                      <Checkbox.Group>
                        <Checkbox value='B'>包含游客用户</Checkbox>
                      </Checkbox.Group>
                    </div>
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    type='primary'
                    onClick={() => {
                      this.fetch()
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.props.form.resetFields()
                    }}
                  >
                    重置
                  </Button>
                </Form.Item>
                <Divider dashed='true' />
              </Form>
              <Table
                dataSource={this.state.dataSource}
                columns={columns}
                rowKey={record => record.id}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
              />
            </div>
          </Content>
          {this.state.handleModal === true ? (
            <ModalOperator handleModal={this.state.handleModal} onChange={this.handleModal} handleValue={this.handleValue} />
          ) : null}
        </Layout>
      </>
    )
  }
}

const wapper = Form.create()(OnlineList)
export default wapper
