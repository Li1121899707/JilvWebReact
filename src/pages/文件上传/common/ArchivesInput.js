// 组织机构下拉树
import React, { Component, Fragment } from 'react'
import { withRouter } from 'umi'

class ArchivesInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: props.match.params.type // show / add / edit
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
    const { data } = this.props
    return <Fragment>{mode === 'show' ? <Fragment>{data}</Fragment> : this.props.children}</Fragment>
  }
}
export default withRouter(ArchivesInput)
