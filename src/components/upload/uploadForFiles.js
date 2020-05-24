import React, { Component } from 'react'
import { Button, Icon, Upload, Modal, notification } from 'antd'
import PropTypes from 'prop-types'
import { get, post } from '@/utils/http'

class UploadForFiles extends Component {
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
      fileList: this.props.fileList
    }
  }

  handleUpload = () => {
    const { fileList } = this.state
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('files', file)
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
          uploading: false
        })

        if (res.data.length > 0) {
          notification.error({
            message: (
              <span>
                {res.data.map(item => (
                  <div>{item};</div>
                ))}
              </span>
            )
          })
        } else {
          notification.success({ message: '导入成功' })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          uploading: false
        })
        notification.error({ message: '请按照导入模板导入' })
      })
  }

  // 获取模板
  getTemplate = () => {
    const { templateUrl } = this.props
    if (templateUrl !== '') {
      get(templateUrl).then(res => {
        const btn = document.createElement('a')
        const event = new MouseEvent('click')
        btn.href = `${window.server}${res.data}`
        btn.download = true
        btn.dispatchEvent(event)
      })
    }
  }

  render() {
    console.log(this.props)
    const uploadPropsForFile = {
      name: 'files',
      // style: { padding: 100 },
      multiple: this.props.multiple,
      accept: this.props.type ? this.props.type :'.xlsx',
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
    const { name } = this.props
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
            // <a onClick={this.getTemplate} style={{ float: 'left', marginTop: 6 }}>
            //   下载模板
            // </a>,
            <Button type='primary' onClick={this.handleUpload} disabled={this.state.fileList.length === 0} loading={this.state.uploading}>
              {this.state.uploading ? '正在上传' : '开始上传'}
            </Button>,
            <Button
              onClick={() => {
                this.props.handleCancel()
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

export default UploadForFiles
