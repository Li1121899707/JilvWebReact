// 组织机构下拉树
import React, { Component, Fragment } from 'react'
import { withRouter } from 'umi'

class DisplayControlComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 页面为show 模式 不显示 ， 非show 显示 children
      mode: props.match.params.type ? props.match.params.type : 'show' // show
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.match.params.type !== state.mode) {
      return {
        mode: props.match.params.type
      }
    }
    return null
  }

  render() {
    const { mode } = this.state
    const { propsMode } = this.props // props 如果传 了 mode ，按照propsMode 的优先级高
    const theMode = propsMode || mode
    return <Fragment>{theMode === 'show' ? null : this.props.children}</Fragment>
  }
}
export default withRouter(DisplayControlComponent)
