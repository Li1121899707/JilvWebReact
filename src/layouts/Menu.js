import React, { Component } from 'react'
import { Menu, Icon } from 'antd'
import Link from 'umi/link'
import withRouter from 'umi/withRouter'
import defaultSettings from '../../config/defaultSettings'
import routers from '../../config/router.config'
import { get } from '@/utils/http'

const { SubMenu } = Menu
class BasicMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuArr: [],
      openKey: []
    }
  }

  componentWillMount() {
    this.getUser()
  }

  componentDidMount() {
    this.getMenu()
  }

  getMenu = () => {
    // 请求routers
    // get('SysMenuResource/findRoleMenu').then(res => {
    //   this.setState({ menuArr: res.data })
    // })
    this.setState({ menuArr: routers })
  }

  getUser = () => {
    get('sys/user-employees/currentUserInfo').then(res => {
      window.USER = res.data
    })
  }

  onOpenChange = openKeys => {
    const xtgl = ['基本情况', '廉洁档案管理', '案件监督管理', '统计分析', '四种形态智能化预警管理']
    const xfgl = ['基本情况', '廉洁档案管理', '系统管理', '统计分析', '四种形态智能化预警管理']
    if (openKeys.length <= 1) {
      this.setState({ openKey: openKeys }) // 如果是 关闭或者第一次打开
    } else if (this.state.openKey[0] === '系统管理') {
      if (xtgl.includes(openKeys[openKeys.length - 1])) {
        const newKeys = []
        newKeys.push(openKeys[openKeys.length - 1])
        this.setState({ openKey: newKeys })
      } else {
        const newKeys = openKeys.filter(item => item !== this.state.openKey[1])
        this.setState({ openKey: newKeys })
      }
    } else if (this.state.openKey[0] === '案件监督管理') {
      if (xfgl.includes(openKeys[openKeys.length - 1])) {
        const newKeys = []
        newKeys.push(openKeys[openKeys.length - 1])
        this.setState({ openKey: newKeys })
      } else {
        const newKeys = openKeys.filter(item => item !== this.state.openKey[1])
        this.setState({ openKey: newKeys })
      }
    } else {
      const newKeys = openKeys.filter(item => item !== this.state.openKey[0])
      this.setState({ openKey: newKeys })
    }
    sessionStorage.setItem('menuOpenKeys', JSON.stringify(openKeys))
  }

  menuMap = menu => {
    return menu.map(item => {
      if (item.hideMenu) return null // 改为 ！item.isShow  item.routes 改为 item.children
      if (!item.name && !item.routes) return null
      if (item.name && !item.routes) {
        const icon = item.icon ? <Icon type={item.icon} /> : null
        return (
          <Menu.Item key={item.path}>
            <Link to={item.path}>
              {icon}
              {item.name}
            </Link>
          </Menu.Item>
        )
      }
      if (item.name && item.routes) {
        const icon = item.icon ? <Icon type={item.icon} /> : null
        return (
          <SubMenu
            key={item.name}
            title={
              <span>
                {icon}
                {item.name}
              </span>
            }
          >
            {this.menuMap(item.routes)}
          </SubMenu>
        )
      }
      if (!item.name && item.routes) {
        return this.menuMap(item.routes)
      }
    })
  }

  getResultArr = theRouters => {
    const menuArr = this.menuMap(theRouters).filter(item => item !== null)
    const resultArr = []
    const foreach = arr => {
      arr.forEach(item => {
        if (item instanceof Array) {
          foreach(item)
        } else {
          resultArr.push(item)
        }
      })
    }
    foreach(menuArr)
    return resultArr
  }

  onSelect = item => {
    sessionStorage.setItem('menuSelectKeys', JSON.stringify(item.key))
  }

  render() {
    return (
      <Menu
        theme={defaultSettings.navTheme}
        mode={defaultSettings.menuMode}
        onSelect={this.onSelect}
        defaultSelectedKeys={[JSON.parse(sessionStorage.getItem('menuSelectKeys'))]}
        defaultOpenKeys={JSON.parse(sessionStorage.getItem('menuOpenKeys'))}
        onOpenChange={this.onOpenChange}
        openKeys={this.state.openKey}
      >
        {this.getResultArr(this.state.menuArr)}
      </Menu>
    )
  }
}

export default withRouter(BasicMenu)
