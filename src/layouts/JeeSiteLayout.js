import React from 'react'
import { Layout, Menu, Icon, Dropdown, Avatar, ConfigProvider } from 'antd'
import Link from 'umi/link'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import defaultSettings from '../../config/defaultSettings'
import styles from './JeeSiteLayout.less'
import 'moment/locale/zh-cn'
import BasicMenu from './Menu'
import { post } from '@/utils/http'

moment.locale('zh-cn')
const { Header, Content, Sider } = Layout
export default function BasicLayout(props) {
  function logout() {
    let userName = sessionStorage.getItem('USERNAME')
    let data = new FormData()
    data.append('userName', userName)
    post(`logout`, data).then(res => {
      window.location.href = '#/login'
      sessionStorage.clear()
    })
  }

  const user_menu = (
    <Menu>
      {/* <Menu.Item key='1'>
        <Link to='/app/zhgl'>帐号管理</Link>
      </Menu.Item> */}
      <Menu.Item key='2' onClick={logout}>
        退出
      </Menu.Item>
    </Menu>
  )

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header className={styles.header}>
          <div className={styles.logo} />
          {/* <p className={styles.title} style={{ color: defaultSettings.primaryColor }}> */}
          {/* {defaultSettings.title} */}
          {/* </p> */}
          <Dropdown className={styles.dropdown} overlay={user_menu}>
            <a className='ant-dropdown-link'>
              <span style={{color:'#fff'}}>{` ${sessionStorage.getItem('USERNAME')}`}</span>
              <Icon type='down'/>
            </a>
          </Dropdown>
        </Header>
        <Layout>
          <Sider className={styles.rwSider} theme={defaultSettings.navTheme} width={226}>
            <BasicMenu />
          </Sider>
          <Content>{props.children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
