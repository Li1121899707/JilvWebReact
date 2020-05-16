// 组织机构下拉树
import React, { Component, Fragment } from 'react'
import { withRouter } from 'umi'

class TableInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: props.match.params.type ? props.match.params.type : 'show' // show / edit /add
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
    const { data, propsMode } = this.props // props 如果传 了 mode ，按照propsMode 的优先级高
    const theMode = propsMode || mode
    return <Fragment>{theMode === 'show' ? <Fragment>{data}</Fragment> : this.props.children}</Fragment>
  }
}
export default withRouter(TableInput)
