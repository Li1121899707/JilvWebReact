import React, { Component } from 'react'
import { Button, Icon, Modal, Upload } from 'antd'

class PictureModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // archivesModal: false,

      fileList: [],
      filesList: [],
      uploading: false,
    }
  }

  handleUpload = () => {
    const { fileList, filesList } = this.state
    const formData = new FormData()
    fileList.forEach(file => {
      formData.append('files[]', file)
    })
    filesList.forEach(file => {
      formData.append('files[]', file)
    })

    this.setState({
      uploading: true,
    })

    // You can use any AJAX library you like
    // reqwest({
    //   url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //   method: 'post',
    //   processData: false,
    //   data: formData,
    //   success: () => {
    //     this.setState({
    //       fileList: [],
    //       uploading: false,
    //     })
    //     message.success('upload successfully.')
    //   },
    //   error: () => {
    //     this.setState({
    //       uploading: false,
    //     })
    //     message.error('upload failed.')
    //   },
    // })
  }

  render() {
    const { uploading, fileList } = this.state
    // console.log(this.props)
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }))
        return false
      },
      fileList,
    }
    return (
      <div>
        <Modal
          width='1000px'
          visible={this.props.pictureModal}
          title='导入照片'
          // onOk={}
          onCancel={this.props.handleCancel}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ width: '46%' }}>
              <Upload {...props}>
                <Button>
                  <Icon type='upload' /> 选择文件
                </Button>
              </Upload>
            </div>
            <div style={{ width: '46%' }}>
              <Upload
                directory
                onChange={e =>
                  this.setState({
                    filesList: e.fileList,
                  })
                }
              >
                <Button>
                  <Icon type='upload' /> 选择文件夹
                </Button>
              </Upload>
            </div>
          </div>

          <Button type='primary' onClick={this.handleUpload} disabled={fileList.length === 0} loading={uploading} style={{ marginTop: 16 }}>
            {uploading ? '正在导入' : '开始导入'}
          </Button>
          <p>1、照片文件命名方法：姓名-身份证号.jpg(支持jpg,png格式)</p>
          <p>2、照片尺寸:3.5*5.3</p>
        </Modal>
      </div>
    )
  }
}

export default PictureModal
