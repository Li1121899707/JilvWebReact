import { router } from 'umi'
import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tabs, Tag, Icon, Popconfirm, notification, Modal } from 'antd'
import moment from 'moment'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'
import SearchForPerson from '@/pages/文件上传/SearchForPerson'
import SearchForArchives from '@/pages/文件上传/SearchForArchives'

const { Option } = Select
const { TabPane } = Tabs

class AnJuanGuanLi extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      addModal: false,
      pagination: { current: 0, pageSize: this.PageSize },
      procedureData: [
        { title: '商请提前介入审理审批表' },
        { title: '案件移送审理审批表' },
        { title: '案件审理工作延期申请呈批表' },
        { title: '审理报告呈批表' },
        { title: '审理报告' }
      ],
      dataSource: []
    }
  }

  componentDidMount() {
    //this.fetch()
  }

  // fetch = (params = {}) => {
  //   let fidldsValue = {}
  //   this.props.form.validateFields((err, values) => {
  //     fidldsValue = {
  //       ...values,
  //       startTime: values.startTime ? dateToUTC(values.startTime) : '',
  //       endTime: values.endTime ? dateToUTC(values.endTime) : ''
  //     }
  //   })
  //   this.setState({ loading: true })
  //   const newParams = { page: 0, size: this.PageSize, ...fidldsValue, ...params }
  //   get('operate-logs', newParams).then(res => {
  //     const { pagination } = this.state
  //     if (Object.keys(params).length === 0 && pagination.current !== 0) {
  //       pagination.current = 0
  //     }
  //     pagination.total = parseInt(res.headers['x-total-count'], 10)
  //     this.setState({
  //       dataSource: res.data,
  //       loading: false,
  //       pagination
  //     })
  //   })
  // }

  handleTableChange = (pagination, filters) => {
    const pager = { ...this.state.pagination }
    pager.current = pagination.current - 1
    this.setState({ pagination })
    this.fetch({
      page: pager.current,
      ...filters
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const defaultValue = JSON.parse(sessionStorage.getItem(''))
    const columns = [
      {
        title: '顺序号',
        align: 'center',
        dataIndex: 'no',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: '题名',
        align: 'center',
        dataIndex: 'title',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '文档编号',
        align: 'center',
        dataIndex: 'num',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '完成日期',
        dataIndex: 'date',
        align: 'center'
        // render: text => {
        //   return moment(text).format('YYYY-MM-DD')
        // }
      },
      {
        title: '责任人',
        align: 'center',
        dataIndex: 'name',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '页号',
        align: 'center',
        dataIndex: 'name',
        render: text => {
          if (text === null) {
            const color = ''
            const status = ''
            return <Tag color={color}>{status}</Tag>
          }
          return text
        }
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operate',
        render: text => {
          return (
            <div>
              <Button type='link' size='small'>
                查看
              </Button>
              <Button type='link' size='small'>
                移除
              </Button>
              <Button type='link' size='small'>
                下载
              </Button>
            </div>
          )
        }
      }
    ]
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 }
    }
    return (
      <div>
        <Breadcrumbs />
        <div className='content-box'>
          <div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', float: 'left', width: '90%' }}>卷内目录</p>
              <Button type='primary'>填加案卷文件</Button>
            </div>
            <Table
              bordered
              title={() => (
                <div>
                  <span>案卷提名:</span>
                  <span style={{ marginLeft: 20 }}>案卷编号:</span>
                </div>
              )}
              rowKey={record => record.id}
              dataSource={this.state.procedureData}
              columns={columns}
              pagination={false}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
          <Button type='primary' style={{ marginTop: 10, marginLeft: '95%' }} onClick={() => router.push('/admin/petition/manage/archive')}>
            返回
          </Button>
        </div>
      </div>
    )
  }
}
export default Form.create()(AnJuanGuanLi)
