import React from 'react'
import BraftEditor from 'braft-editor'
// import MaxLength from 'braft-extensions/dist/max-length'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import PropTypes from 'prop-types'
import { Upload, Icon } from 'antd'
import { Error_modal } from '@/utils/Modal'

export default class BraftEditorComp extends React.Component {
  // // 如果没有传递该属性时的默认值
  static defaultProps = {
    data: `<header><img width='802px' src=${require('./biaotou.png')} /></header><br />`
  }

  // 如果传递该属性，该属性值必须为字符串
  static propTypes = {
    data: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      editorState: BraftEditor.createEditorState(`${this.props.data}<br/><footer><img width='802px' src=${require('./biaowei.png')} /></footer>`), // 设置编辑器初始内容
      locked: true
    }
  }

  componentDidMount() {}

  componentWillUpdate(nextProps, nextState, nextContext) {
    console.log(nextProps, 'nextProps')
    if (!this.state.locked) {
      this.state.locked = true
      this.state.editorState = BraftEditor.createEditorState(nextProps.data)
    }

    // console.log(this.state.editorState.toHTML())
    // console.log(nextState.editorState.toHTML(), 'nextState')
  }

  componentWillUnmount() {}

  pushData = () => {
    return this.editorRef.getValue().toHTML()
  }

  handleChange = editorState => {
    // 过滤<p></p>标签
    // htmlContent = htmlContent.replace(/<p><\/p>/g, '')
    let htmlContent = editorState.toHTML()
    // console.log(editorState)
    // console.log(htmlContent)
    this.props.getContent(htmlContent)
    this.setState({
      editorState
    })
  }

  uploadChange = info => {
    if (info.file.status === 'error') {
      Error_modal(`${info.file.name} 上传失败`)
      return
    }
    if (info.file.status === 'done') {
      let { file } = info
      // console.log(file)
      this.editorRef.setValue(
        ContentUtils.insertMedias(this.editorRef.getValue(), [
          {
            type: 'IMAGE',
            url: window.server + file.response
          }
        ])
      )
      // this.setState({
      //   editorState: ContentUtils.insertMedias(this.state.editorState, [
      //     {
      //       type: 'IMAGE',
      //       url: fileList[0].url,
      //     },
      //   ]),
      // })
    }
  }

  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open(this.buildPreviewHtml())
    window.previewWindow.document.write(this.buildPreviewHtml())
    window.previewWindow.document.close()
  }

  buildPreviewHtml() {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>预览</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 844px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
            }
            .image-wrap img{
                display: block; /*用于消除图片默认的下边距，或者用line-height:0;也行*/
             }
            .image-wrap + p:empty{
                display: none;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
          <script type="text/javascript">
           var box = document.querySelector('.container')
           // console.log(this.editorRef.getValue().toHTML())
        </script>
        </head>
        <body>
          
          <div class="container">${this.editorRef.getValue().toHTML()}</div>
        </body>
        
      </html>
    `
  }

  render() {
    const { editorState } = this.state
    // console.log(editorState, this.props.data)
    // const htmlContent = editorState.toHTML()
    // console.log(htmlContent)
    const uploadProps = {
      name: 'photo',
      accept: 'image/*',
      multiple: false,
      showUploadList: false,
      action: `${window.server}/api/articles/uploadArticleImg`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      onChange: this.uploadChange
    }
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload {...uploadProps}>
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type='button' className='control-item button upload-button'>
              插入图片
            </button>
          </Upload>
        )
      },
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ]
    // const options = {
    //   defaultValue: 10, // 指定默认限制数，如不指定则为Infinity(无限)
    // };
    // BraftEditor.use(MaxLength(options));
    const blockExportFn = (contentState, block) => {
      const previousBlock = contentState.getBlockBefore(block.key)
      if (block.type === 'unstyled' && previousBlock && previousBlock.getType() === 'atomic') {
        return {
          start: '',
          end: ''
        }
      }
    }
    return (
      <div className='editor-wrapper'>
        <BraftEditor
          ref={ref => (this.editorRef = ref)}
          defaultValue={editorState}
          value={editorState}
          // converts={{ blockExportFn }}
          extendControls={extendControls}
          // maxLength={10}
          // onReachMaxLength={(e) => console.log('不能再输入了！',e)}
          onChange={(e,i)=>{this.handleChange(e)}}
          contentStyle={{ height: 1000 }}
        />
      </div>
    )
  }
}
