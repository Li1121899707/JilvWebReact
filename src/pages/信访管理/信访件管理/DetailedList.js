/**
 * @Author 王舒宁
 * @Date 2020/3/15 20:44
 **/

import React, { Component } from 'react'
import { Form, Col, Row, Input, Select, DatePicker, Button, Divider, Table, Tag } from 'antd'
// import moment from 'moment'
import { router } from 'umi'
import Breadcrumbs from '@/components/Breadcrumb'
import style from '@/pages/信访管理/Index.less'
import UploadForFiles from "@/components/upload/uploadForFiles";
// import { get, put } from '@/utils/http'
// import { dateToUTC } from '@/utils/common'

const { Option } = Select

class DetailedList extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      pagination: { current: 0, pageSize: this.PageSize },
      name: '',
      url: '',
      templateUrl: '',
      dataSource: [
        {
          num: '00001',
          perNum: '10008',
          beiName: '张三',
          unit: '金谷农商银行',
          zhiWu: '主任',
          startDate: '2019.05.12',
          chuZhi: '0002',
          laiYuan: '微信公众号',
          fanyingName: '陈某',
          state: '信访件已导入'
        },
        {
          num: '00002',
          perNum: '10009',
          beiName: '李四',
          unit: '金谷农商银行',
          zhiWu: '主任',
          startDate: '2019.05.12',
          chuZhi: '0001',
          laiYuan: '上级交办',
          fanyingName: '陈某',
          state: '信访件已导入'
        }
      ]
    }
    this.managementMode = ['全部', '自办', '转办', '交办', '督办', '协调']
    this.letterSource = [
      '全部',
      '举报邮箱',
      '微信公众号',
      '来信来函',
      '电话举报',
      '上级交办',
      '公检法机关移交',
      '监督检查中发现',
      '审查调查中发现',
      '审计中发现',
      '巡视巡查中发现',
      '其他行政执法机关移交',
      '其他'
    ]
    this.managementStatus = [
      '全部',
      '信访件已导入',
      '线索已登记',
      '已填写拟办意见',
      '已审批',
      '已上会',
      '谈话函询中',
      '初步核实中',
      '审查调查中',
      '审理中',
      '已办结',
      '暂存待查'
    ]
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

  handleCancelForFile = () => {
    this.setState({
      uploadModal: false
    })
    // this.fetch()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const defaultValue = JSON.parse(sessionStorage.getItem(''))
    const columns = [
      {
        title: '序号',
        align: 'center',
        dataIndex: 'no',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: '信访件编号',
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
        title: '导入人员编码',
        align: 'center',
        dataIndex: 'perNum',
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
        title: '反映内容',
        align: 'center',
        dataIndex: 'chuZhi',
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
        title: '线索来源',
        align: 'center',
        dataIndex: 'laiYuan',
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
        title: '反映人',
        align: 'center',
        dataIndex: 'fanyingName',
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
        title: '被反映人',
        align: 'center',
        dataIndex: 'beiName',
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
        title: '办理状态',
        align: 'center',
        dataIndex: 'state',
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
        render: (text, record) => {
          return (
            <div>
              <Button type='link' size='small'>
                查看
              </Button>
              <Button type='link' size='small'>
                删除
              </Button>
            </div>
          )
        }
      }
    ]
    return (
      <div className={style.content} style={{ textAlign: 'center' }}>
        <div className='content-box'>
          <a className={style.title}>信访件导入清单</a>
          <Button
            style={{ marginLeft: 10, float: 'right' }}
            type='primary'
            onClick={() =>
              this.setState({
                uploadModal: true,
                name: '廉洁档案',
                url: 'petitions/importExcel',
                templateUrl: 'petitions/getExcel'
              })
            }
          >
            批量导入信访件
          </Button>
          <Button type='primary' style={{ float: 'right' }} onClick={() => router.goBack()}>
            确定
          </Button>
          <div>
            <Table
              rowKey={record => record.id}
              dataSource={this.state.dataSource}
              columns={columns}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
            />
          </div>
          <UploadForFiles
            visible={this.state.uploadModal}
            handleCancel={this.handleCancelForFile}
            templateUrl={this.state.templateUrl}
            name={this.state.name}
            url={this.state.url}
          />
        </div>
      </div>
    )
  }
}
export default Form.create()(DetailedList)
