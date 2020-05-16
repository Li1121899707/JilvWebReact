/*
 * @author: 王志鹏
 * @Datetime  2020/1/17 14:32
 */

import React, { Component } from 'react'
import { Button, Icon, Upload, Modal, notification } from 'antd'
import PropTypes from 'prop-types'
import { post } from '@/utils/http'
// import { Error_modal } from '@/utils/Modal'
// import style from './index.less'

class UploadFiles extends Component {
  static defaultProps = {
    listType: 'text',
    fileList: [],
    multiple: true,
    maxNum: 50, //一次性上传最大量， 多了不显示 上传按钮
    uploading: false
  }

  // 如果传递该属性，该属性值必须为字符串
  static propTypes = {
    listType: PropTypes.string,
    multiple: PropTypes.bool,
    fileList: PropTypes.array,
    maxNum: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      fileList: this.props.fileList,
      msg: ''
    }
  }

  handleUpload = () => {
    const { fileList } = this.state
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append(this.props.files, file)
    })
    this.setState({
      uploading: true
    })

    // You can use any AJAX library you like
    const { url } = this.props
    post(url, formData)
      .then(res => {
        this.setState({
          fileList: [],
          uploading: false,
          msg: res.data
        })
        notification.success({ message: '导入成功' })
      })
      .catch(error => {
        console.log(error)
        this.setState({
          uploading: false
        })
        notification.error({ message: '请按照导入模板导入' })
      })
  }

  render() {
    const uploadPropsForFile = {
      name: 'files',
      // style: { padding: 100 },
      multiple: this.props.multiple,
      listType: this.props.listType,
      // action: `${window.server}/api/excel/readHonestExcel`,
      fileList: this.state.fileList,
      // headers: {
      //   Authorization: `Bearer ${sessionStorage.getItem('token')}`
      // },

      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList
          }
        })
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }))
        return false
      }
    }
    const { type, name } = this.props
    const uploadBtn = (
      <Button>
        <Icon type='upload' /> 上传
      </Button>
    )
    return (
      <div className='upload'>
        <Modal
          width='500px'
          visible={this.props.visible}
          title={`导入${name}`}
          destroyOnClose
          // key={Math.random()}
          // onOk={}
          onCancel={this.props.handleCancel}
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            <Button
              type='primary'
              onClick={this.handleUpload}
              disabled={this.state.fileList.length === 0}
              loading={this.state.uploading}
              key={Math.random()}
            >
              {this.state.uploading ? '正在上传' : '开始上传'}
            </Button>,
            <Button
              onClick={() => {
                this.props.handleCancel()
                this.props.parent.getChildrenMsg(this, this.state.msg)
                this.setState({ fileList: [] })
              }}
              key={Math.random()}
            >
              关闭
            </Button>
          ]}
        >
          <Upload {...uploadPropsForFile}>{this.state.fileList.length >= this.props.maxNum ? null : uploadBtn}</Upload>
        </Modal>
      </div>
    )
  }
}

export default UploadFiles
