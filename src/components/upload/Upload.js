import React from 'react'
import { Button, Icon, Upload, Modal } from 'antd'
import PropTypes from 'prop-types'
// import { get, post } from '@/utils/http'
import { Error_modal } from '@/utils/Modal'
import style from './index.less'
import {exportFiles} from "@/utils/common";

class UploadComp extends React.Component {
  // // 如果没有传递该属性时的默认值
  static defaultProps = {
    listType: 'text',
    fileList: [],
    multiple: true,
    maxNum: 999 //一次性上传最大量， 多了不显示 上传按钮
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
      previewVisible: false,
      fileList: this.props.fileList
    }
    this.locked=false
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.locked&& prevProps.fileList.length>0){
      this.setState({
        fileList: prevProps.fileList
      })
      this.locked = true
    }
  }

  handleChangefile = info => {
    if (info.file.status === 'error') {
      Error_modal(`${info.file.name} 上传失败`)
      this.setState({ fileList: [...info.fileList] })
      return
    }
    // 删除图片 两种情况 1.刚刚上传到oss的图片删除，没有保存到数据库 ， 2.已经上传的且保存到数据库的图片删除，编辑已发布产品的 主图模块
    // 根据是否有 id 字段 判断 是1 or 2
    if (info.file.status === 'removed') {
      this.setState({ fileList: [...info.fileList] })
      return
    }
    //上传成功
    if (info.file.status === 'done') {
      // this.props.uploadForPhoto(info.file.response)
      let fileList = [...info.fileList]
      // fileList = fileList.slice(-2)
      fileList = fileList.map(file => {
        if (file.response) {
          file.url = window.server + file.response.path // 添加url 属性，用于大图预览
          file.thumbUrl = ''
        }
        return file
      })
      this.setState({ fileList })
      return
    }

    // 不能删除 否则 只会进入本onchange函数 一次 ，捕获不到 done 的onchange 事件回调
    if (info.file.status === 'uploading') {
      this.setState({ fileList: [...info.fileList] })
    }
  }

  handlePreview = file => {
      exportFiles(`${window.server}/api/files/${file.response.path}`,file.response.path)
  }

  render() {
    console.log(this.props.fileList)
    const uploadProps = {
      name: 'file',
      // style: { padding: 100 },
      multiple: this.props.multiple,
      // accept: '.jpg,.jpeg,.png,.gif,.bmp',
      listType: this.props.listType,
      action: `${window.server}/api/files`,
      fileList: this.state.fileList,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      onChange: this.handleChangefile,
      onPreview: this.handlePreview
    }

    const uploadBtn =
      this.props.listType === 'picture-card' ? (
        <div style={{ width: 180, height: 243, boxSizing: 'border-box', paddingTop: 90 }}>
          <span>
            <Icon type='plus' />
            <div>上传</div>
          </span>
        </div>
      ) : (
        <Button>
          <Icon type='upload' /> 上传
        </Button>
      )

    return (
      <div className='upload' style={{ width: '50%' }}>
        {this.props.listType === 'picture-card' ? (
          <Upload {...uploadProps} className={style.upload}>
            {this.state.fileList.length >= this.props.maxNum ? null : uploadBtn}
          </Upload>
        ) : (
          <Upload {...uploadProps}>{this.state.fileList.length >= this.props.maxNum ? null : uploadBtn}</Upload>
        )}

        <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
          <img alt='预览' style={{ width: '100%' }} src={this.state.previewImage ? this.state.previewImage : `${window.server}${this.props.data}`} />
        </Modal>
      </div>
    )
  }
}

export default UploadComp
