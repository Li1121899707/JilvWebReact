/**
 * @Author 王舒宁
 * @Date 2020/2/20 14:52
 **/

import { router } from 'umi'
import React, { Component } from 'react'
import { Form, Col, Row, Input, Button, Divider, Table, Tabs, Tag } from 'antd'
// import moment from 'moment'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, put } from '@/utils/http'
import { dateToUTC } from '@/utils/common'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import moment from 'moment'

// const { Option } = Select
const { TabPane } = Tabs

class AnJuanDetail extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      procedureData: [
        { title: '问题线索登记表' },
        { title: '转交办单' },
        { title: '举报材料' },
        { title: '谈话函询呈批表' },
        { title: '谈话方案' },
        { title: '安全预案' },
        { title: '纪律审查审核呈批表' }
      ],
      dataSource: {}
    }
    this.id = this.props.match.params.id
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      this.setState({ dataSource: res.data })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      dataSource: { form }
    } = this.state
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
    return (
      <div>
        <Breadcrumbs />
        <div className='content-box'>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='程序卷内目录' key='1'>
              <div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', float: 'left', width: '90%' }}>程序卷内目录</p>
                  <Button type='primary'>填加案卷文件</Button>
                </div>
                <Table
                  bordered
                  title={() => (
                    <div>
                      <span>案卷提名: {form && form.anJuan.name}</span>
                      <span style={{ marginLeft: 20 }}>案卷编号:</span>
                    </div>
                  )}
                  rowKey={record => record.id}
                  dataSource={[]}
                  columns={columns}
                  pagination={false}
                  loading={this.state.loading}
                />
              </div>
            </TabPane>
            <TabPane tab='主体身份卷卷内目录' key='2'>
              <div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', float: 'left', width: '90%' }}>主体身份卷卷内目录</p>
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
                  dataSource={[]}
                  columns={columns}
                  pagination={false}
                  loading={this.state.loading}
                  onChange={this.handleTableChange}
                />
              </div>
            </TabPane>
          </Tabs>
          <Button type='primary' style={{ marginTop: 10, marginLeft: '95%' }} onClick={() => router.push('/admin/petition/talk/archive')}>
            返回
          </Button>
        </div>
      </div>
    )
  }
}
export default Form.create()(AnJuanDetail)
