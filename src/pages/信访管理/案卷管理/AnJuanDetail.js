import { router } from 'umi'
import React, { Component, Fragment } from 'react'
import { Form, Col, Row, Popconfirm, Button, notification, Table, Tabs, Tag, Modal } from 'antd'
import moment from 'moment'
import Breadcrumbs from '@/components/Breadcrumb'
import { get, post, put } from '@/utils/http'
import { dateToUTC, exportFiles } from '@/utils/common'
import ProcessDefinitionKey from '@/pages/信访管理/common/aboutActiviti'
import UploadComp from '@/components/upload/Upload'

const { TabPane } = Tabs

class AnJuanDetail extends Component {
  constructor(props) {
    super(props)
    this.PageSize = 10
    this.state = {
      loading: false,
      dataSource: { form: { anJuan: {} } }
    }
    this.id = this.props.match.params.id
    this.addAnJuanType = '' // 添加案卷类型 chengXu  zhuTi caiLiao
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get(`activiti/process/instance?processInstanceId=${this.id}`).then(res => {
      let chengXu = this.getChengXuJuan(res.data.form)
      chengXu.push(...res.data.form.anJuan.chengXu)
      this.setState({ dataSource: res.data, chengXu })
    })
  }

  // 获取程序卷列表
  getChengXuJuan = form => {
    const the = this
    let chengXu = [{ uid: Math.random().toString(), response: { fileName: '问题线索登记表' }, time: form.wenTiXianSuo_dengJiTime }]
    // 问题线索附件
    if (form.wenTiXianSuo_files) chengXu.push(...form.wenTiXianSuo_files)
    // 线索处置
    // if (form.wenTiXianSuo_niBanYiJian) chengXu.push(the.formatObj({ fileName: '线索处置表', time: form.wenTiXianSuo_niBanYiJian[0].time }))
    // 线索处置附件
    // if (form.xianSuoChuZhi_files) chengXu.push(...form.xianSuoChuZhi_files)
    // 谈话函询
    if (form.tanHuaHanXun_yiJian) {
      for (let i = 0; i < form.tanHuaHanXun_yiJian.length; i++) {
        if (form.tanHuaHanXun_yiJian[i].tanHuaHanXun_chengPi)
          chengXu.push(the.formatObj({ fileName: '谈话函询呈批表', time: form.tanHuaHanXun_yiJian[i].tanHuaHanXun_chengPi.time }))
        // if (form.tanHuaHanXun_yiJian[i].tanHuaHanXun_chuZhiYiJianChengPi)
        //   chengXu.push(the.formatObj({ fileName: '谈话函询处置意见', time: form.tanHuaHanXun_yiJian[i].tanHuaHanXun_chuZhiYiJianChengPi.time }))
      }
    }
    // 谈话函询附件
    if (form.tanHuaHanXun_files) {
      for (let i = 0; i < form.tanHuaHanXun_files.length; i++) {
        if (form.tanHuaHanXun_files[i].tanHuaHanXun_chengPi_files) chengXu.push(...form.tanHuaHanXun_files[i].tanHuaHanXun_chengPi_files)
        // if (form.tanHuaHanXun_files[i].tanHuaHanXun_chuZhiYiJianChengPi_files)
        //   chengXu.push(...form.tanHuaHanXun_files[i].tanHuaHanXun_chuZhiYiJianChengPi_files)
      }
    }
    // 初步核实呈批表
    if (form.chuBuHeShi_chuBuHeShiChengPi) chengXu.push(the.formatObj({ fileName: '初步核实呈批表', time: form.chuBuHeShi_RiQi }))
    // 初步核实呈批表附件
    if (form.chuBuHeShi_chuBuHeShiChengPi_files) chengXu.push(...form.chuBuHeShi_chuBuHeShiChengPi_files)
    // 初核报告
    if (form.chuBuHeShi_chuHeBaoGaoChengPi)
      chengXu.push(the.formatObj({ fileName: '初步核实情况呈批表', time: form.chuBuHeShi_chuHeBaoGaoChengPi[0].time }))
    // 初步核实报告附件
    if (form.chuBuHeShi_chuHeBaoGaoChengPi_files) chengXu.push(...form.chuBuHeShi_chuHeBaoGaoChengPi_files)
    // 立案审查呈批表
    if (form.shenChaDiaoCha_ChengPi) chengXu.push(the.formatObj({ fileName: '立案审查呈批表', time: form.shenChaDiaoCha_ChengPi[0].time }))
    // 立案审查呈批表附件
    if (form.shenChaDiaoCha_ChengPi_files) chengXu.push(...form.shenChaDiaoCha_ChengPi_files)
    // 回执书
    if (form.shangChuanHuiZhi_files) chengXu.push(...form.shangChuanHuiZhi_files)
    // 立案审查方案呈批表
    if (form.shenChaDiaoCha_fangAnChengPi)
      chengXu.push(the.formatObj({ fileName: '立案审查方案呈批表', time: form.shenChaDiaoCha_fangAnChengPi[0].time }))
    // 立案审查方案呈批表附件
    if (form.shenChaDiaoCha_fangAnChengPi_files) chengXu.push(...form.shenChaDiaoCha_fangAnChengPi_files)
    //延期
    if (form.shenChaDiaoCha_countYanQiYiJian) {
      for (let i = 0; i < form.shenChaDiaoCha_countYanQiYiJian.length; i++) {
        if (form.shenChaDiaoCha_countYanQiYiJian[i].shenChaDiaoCha_yanQiYiJian)
          chengXu.push(
            the.formatObj({ fileName: '立案审查工作延期申请呈批表', time: form.shenChaDiaoCha_countYanQiYiJian[0].shenChaDiaoCha_yanQiYiJian.time })
          )
      }
    }
    //外查
    if (form.shenChaDiaoCha_countWaiChaYiJian) {
      for (let i = 0; i < form.shenChaDiaoCha_countWaiChaYiJian.length; i++) {
        if (form.shenChaDiaoCha_countWaiChaYiJian[i].shenChaDiaoCha_waiChaYiJian)
          chengXu.push(
            the.formatObj({ fileName: '立案外审外查方案呈批表', time: form.shenChaDiaoCha_countWaiChaYiJian[0].shenChaDiaoCha_waiChaYiJian.time })
          )
        // 外查 附件
        if (form.shenChaDiaoCha_countWaiChaYiJian[i].shenChaDiaoCha_waiChaGongZuo_files)
          chengXu.push(...form.shenChaDiaoCha_countWaiChaYiJian[i].shenChaDiaoCha_waiChaGongZuo_files)
      }
    }
    // 立案审查报告呈批表
    if (form.shenChaDiaoCha_baoGaoChengPi)
      chengXu.push(the.formatObj({ fileName: '立案审查报告呈批表', time: form.shenChaDiaoCha_baoGaoChengPi[0].time }))
    // 立案审查报告呈批表 附件
    if (form.shenChaDiaoCha_baoGaoChengPi_files) chengXu.push(...form.shenChaDiaoCha_baoGaoChengPi_files)
    // 提前介入审理审批表
    if (form.shenChaDiaoCha_tiQianJieRu)
      chengXu.push(the.formatObj({ fileName: '提前介入审理审批表', time: form.shenChaDiaoCha_tiQianJieRu[0].time }))
    // 案件移送审理审批表
    if (form.shenChaDiaoCha_anJianYiSong)
      chengXu.push(the.formatObj({ fileName: '案卷移送审理审批表', time: form.shenChaDiaoCha_anJianYiSong[0].time }))
    // 案件移送审理审批表 附件
    if (form.shenChaDiaoCha_anJianYiSong_files) chengXu.push(...form.shenChaDiaoCha_anJianYiSong_files)

    //提前介入审理意见呈批表
    if (form.shenLiGuanLi_tiQianJieRuChengPi)
      chengXu.push(the.formatObj({ fileName: '提前介入审理意见呈批表', time: form.shenLiGuanLi_tiQianJieRuChengPi[0].time }))
    //提前介入审理意见呈批表 附件
    if (form.shenLiGuanLi_tiQianJieRuChengPi_files) chengXu.push(...form.shenLiGuanLi_tiQianJieRuChengPi_files)
    // 案件审理工作延期申请呈批表
    if (form.shenLiGuanLi_countYanQiYiJian) {
      for (let i = 0; i < form.shenLiGuanLi_countYanQiYiJian.length; i++) {
        if (form.shenLiGuanLi_countYanQiYiJian[i].shenLiGuanLi_yanQiYiJian)
          chengXu.push(
            the.formatObj({ fileName: '案件审理工作延期申请呈批表', time: form.shenLiGuanLi_countYanQiYiJian[0].shenLiGuanLi_yanQiYiJian.time })
          )
      }
    }
    //审理报告呈批表
    if (form.shenLiGuanLi_shenLiBaoGaoChengPi)
      chengXu.push(the.formatObj({ fileName: '审理报告呈批表', time: form.shenLiGuanLi_shenLiBaoGaoChengPi[0].time }))
    //审理报告呈批表 附件
    if (form.shenLiGuanLi_shenLiBaoGaoChengPi_files) chengXu.push(...form.shenLiGuanLi_shenLiBaoGaoChengPi_files)
    return chengXu
  }

  formatObj = obj => {
    return {
      uid: Math.random().toString(),
      response: { fileName: obj.fileName, time: obj.time }
    }
  }

  submit = form => {
    post(`activiti/setProcessVariables/${this.id}`, form).then(res => {
      notification.success({ message: '提交成功' })
      this.setState({ visible: false })
      this.fetch()
    })
  }

  saveAnJuan = () => {
    const { fileList } = this.fileRef.state
    if (!fileList || fileList.length <= 0) {
      notification.warning({ message: '未上传案卷' })
      return
    }
    const { anJuan } = this.state.dataSource.form
    fileList.forEach(item => {
      item.can_remove = true
    })
    anJuan[this.addAnJuanType].push(...fileList)
    this.submit(this.state.dataSource.form)
  }

  removeFile = (index, type, record) => {
    const { anJuan } = this.state.dataSource.form
    anJuan[type] = anJuan[type].filter(item => item.uid !== record.uid)
    this.submit(this.state.dataSource.form)
  }

  showModal = type => {
    this.addAnJuanType = type
    this.setState({ visible: true })
  }

  operatePdf = (type, table) => {
    post(`dossier/exportCluePdf?processInstanceId=${this.id}&type=${table}`).then(res => {
      if (type === '下载') this.downloadPdf(res.data)
      else this.previewPdf(res.data)
    })
  }

  downloadPdf = fileName => {
    exportFiles(`${window.server}/api/dossier/getPdf/${fileName}`, fileName)
  }

  previewPdf = fileName => {
    window.open(`${window.server}/api/dossier/previewPdf/${fileName}`)
  }

  columns = type => {
    return [
      {
        title: '顺序号',
        align: 'center',
        dataIndex: 'no',
        render: (text, record, index) => <span>{index + 1}</span>
      },
      {
        title: '题名',
        align: 'center',
        dataIndex: 'response.fileName'
      },
      {
        title: '文档编号',
        align: 'center',
        dataIndex: 'num'
      },
      {
        title: '完成日期',
        dataIndex: 'response.time',
        align: 'center',
        render: text => {
          return moment(text).format('YYYY-MM-DD')
        }
      },
      {
        title: '责任人',
        align: 'center',
        dataIndex: 'user'
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operate',
        render: (text, record, index) => {
          //程序卷呈批表和附件不能移除
          return (
            <div>
              {record.response.fileName && !record.name && (
                <Fragment>
                  <Button type='link' size='small' onClick={() => this.operatePdf('查看', record.response.fileName)}>
                    查看
                  </Button>
                  <Button type='link' size='small' onClick={() => this.operatePdf('下载', record.response.fileName)}>
                    下载
                  </Button>
                </Fragment>
              )}
              {record.response.path && (
                <a
                  target='_blank'
                  onClick={() => exportFiles(`${window.server}/api/dossier/getPdf/${record.response.fileName}`, record.response.fileName)}
                >
                  下载
                </a>
              )}
              {((type === 'chengXu' && record.can_remove) || type !== 'chengXu') && (
                <Popconfirm title='确认删除吗' onConfirm={() => this.removeFile(index, type, record)}>
                  <Button type='link' size='small'>
                    移除
                  </Button>
                </Popconfirm>
              )}
            </div>
          )
        }
      }
    ]
  }

  render() {
    const { dataSource } = this.state
    const { form } = dataSource
    const { anJuan } = form
    return (
      <div>
        <Breadcrumbs />
        <div className='content-box'>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='程序卷卷内目录' key='1'>
              <div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', float: 'left', width: '90%' }}>程序卷内目录</p>
                  <Button type='primary' onClick={() => this.showModal('chengXu')}>
                    填加案卷文件
                  </Button>
                </div>
                <Table
                  bordered
                  title={() => (
                    <div>
                      <span>案卷提名: {form && form.anJuan.name}</span>
                      <span style={{ marginLeft: 20 }}>案卷编号:</span>
                    </div>
                  )}
                  rowKey={record => record.uid}
                  dataSource={this.state.chengXu}
                  columns={this.columns('chengXu')}
                  pagination={false}
                  loading={this.state.loading}
                />
              </div>
            </TabPane>
            <TabPane tab='主体身份卷卷内目录' key='2'>
              <div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', float: 'left', width: '90%' }}>主体身份卷卷内目录</p>
                  <Button type='primary' onClick={() => this.showModal('zhuTi')}>
                    填加案卷文件
                  </Button>
                </div>
                <Table
                  bordered
                  title={() => (
                    <div>
                      <span>案卷提名: {form && form.anJuan.name}</span>
                      <span style={{ marginLeft: 20 }}>案卷编号:</span>
                    </div>
                  )}
                  rowKey={record => record.uid}
                  dataSource={anJuan.zhuTi}
                  columns={this.columns('zhuTi')}
                  pagination={false}
                  loading={this.state.loading}
                  onChange={this.handleTableChange}
                />
              </div>
            </TabPane>
            <TabPane tab='材料卷卷内目录' key='3'>
              <div>
                <div>
                  <p style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', float: 'left', width: '90%' }}>材料卷卷内目录</p>
                  <Button type='primary' onClick={() => this.showModal('caiLiao')}>
                    填加案卷文件
                  </Button>
                </div>
                <Table
                  bordered
                  title={() => (
                    <div>
                      <span>案卷提名: {form && form.anJuan.name}</span>
                      <span style={{ marginLeft: 20 }}>案卷编号:</span>
                    </div>
                  )}
                  rowKey={record => record.uid}
                  dataSource={anJuan.caiLiao}
                  columns={this.columns('caiLiao')}
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
        <Modal
          title='上传案卷'
          visible={this.state.visible}
          onOk={this.saveAnJuan}
          onCancel={() => {
            this.setState({ visible: false })
          }}
        >
          <UploadComp
            key={dataSource.wenTiXianSuo_xuHao || 0}
            ref={ref => {
              this.fileRef = ref
            }}
          />
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AnJuanDetail)
