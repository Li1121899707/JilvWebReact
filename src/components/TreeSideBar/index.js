import React, { Component } from 'react'
import { Layout, Icon, Tree } from 'antd'
import Link from 'umi/link'
import styles from './index.less'
import { get } from '../../utils/http'

const { Sider } = Layout
const { TreeNode } = Tree

class TreeSideBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      expandedKeys: [],
      isExpanded: false,
      data: [],
      selectedKeys: []
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    get('sys-offices/tree').then(res => {
      this.setState({ data: res.data })
    })
  }

  refresh = () => {
    this.setState({ data: [] })
    this.fetch()
  }

  onExpand = (expandedKeys, { expanded: bool, node }) => {
    this.setState({ expandedKeys })
  }

  toggleExpand = () => {
    const { isExpanded, data } = this.state
    if (isExpanded) {
      this.setState({
        isExpanded: false,
        expandedKeys: []
      })
      this.expandedKeys = null // 避免每次遍历 提升效率
    } else {
      if (!this.expandedKeys) {
        this.expandedKeys = []
        const loop = datas => {
          datas.forEach(item => {
            if (item.children) {
              this.expandedKeys.push(item.sysOffice.id.toString())
              loop(item.children)
            }
          })
        }
        loop(data)
      }
      this.setState({
        expandedKeys: this.expandedKeys,
        isExpanded: true
      })
    }
  }

  renderTree = data => {
    return data.map(item => {
      return (
        <TreeNode key={item.sysOffice.id.toString()} title={item.sysOffice.officeName}>
          {item.children ? this.renderTree(item.children) : null}
        </TreeNode>
      )
    })
  }

  onSelect = value => {
    const v = value[0] ? value[0] : null
    this.props.onSelect(v)
    this.setState({ selectedKeys: value })
  }

  render() {
    const { isExpanded, expandedKeys, data, selectedKeys } = this.state
    const treeOpt = this.renderTree(data)
    return (
      <Sider
        style={this.props.style}
        className={styles.sider}
        theme='light'
        width={220}
        collapsible
        collapsedWidth={0}
        collapsed={this.state.collapsed}
        onCollapse={collapsed => {
          this.setState({ collapsed })
        }}
      >
        <div className={styles.header}>
          <span className={styles.tit}>组织机构</span>
          <Link to='/admin/system/organ/organizelist' title='编辑'>
            <Icon type='edit' />
          </Link>
          <span onClick={this.toggleExpand} title={isExpanded ? '折叠' : '展开'}>
            {isExpanded ? <Icon type='up' /> : <Icon type='down' />}
          </span>
          <span onClick={this.refresh} title='刷新'>
            <Icon type='redo' />
          </span>
        </div>
        <div className={styles.treeDiv}>
          <Tree
            expandedKeys={expandedKeys}
            onExpand={this.onExpand}
            blockNode
            style={{ fontSize: 12 }}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {treeOpt}
          </Tree>
        </div>
      </Sider>
    )
  }
}
export default TreeSideBar
