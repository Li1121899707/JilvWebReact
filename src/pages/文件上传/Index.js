/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-25 14:50:43
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-09-03 09:08:13
 * @Description: Description
 */

import React, { Component } from 'react'
import { Form, Tabs } from 'antd'
// import router from 'umi/router'
import { get } from '@/utils/http'

// import styles from './Index.less'
import SearchForArchives from '@/pages/文件上传/SearchForArchives'
import SearchForPerson from '@/pages/文件上传/SearchForPerson'
import Breadcrumbs from '@/components/Breadcrumb'

const { TabPane } = Tabs

class Index extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      // dataSource: [],
      // loading: false,
      pagination: { current: 0, pageSize: this.PageSize }
    }
  }

  componentDidMount() {
    // this.fetch()
  }

  fetch = (params = {}) => {
    let queryConditions = {}
    this.props.form.validateFields((err, values) => {
      if (!err) {
        queryConditions = values
      }
    })
    // this.setState({ loading: true })
    const newParams = { page: 0, size: this.PageSize, ...params, ...queryConditions }
    get('sys-roles', newParams).then(res => {
      const { pagination } = this.state
      if (Object.keys(params).length === 0 && pagination.current !== 0) {
        pagination.current = 0
      }
      pagination.total = parseInt(res.headers['x-total-count'], 10)
      this.setState({
        // loading: false,
        // dataSource: res.data,
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

  render() {
    return (
      <div>
        <Breadcrumbs />
        <div className='content-box'>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='搜索人' key='1'>
              <SearchForPerson />
            </TabPane>
            <TabPane tab='搜索档案' key='2'>
              <SearchForArchives />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

const wapper = Form.create()(Index)
export default wapper
