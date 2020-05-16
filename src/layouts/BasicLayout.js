/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-27 11:50:25
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-08-28 15:54:09
 * @Description: Description
 */

import React from 'react'
import { Layout, Menu, Icon, Dropdown, Avatar, ConfigProvider } from 'antd'
import Link from 'umi/link'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import defaultSettings from '../../config/defaultSettings'
import styles from './BasicLayout.less'
import 'moment/locale/zh-cn'
import BasicMenu from './Menu'
import RouterTabs from '../components/RouterTabs'

moment.locale('zh-cn')
const { Header, Content, Sider } = Layout
export default function BasicLayout(props) {
  function logout() {
    sessionStorage.clear()
    window.location.href = '#/login'
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
      <Layout style={{ minHeight: '100vh', height: '100%' }}>
        <Sider className={styles.rwSider} theme={defaultSettings.navTheme} width={226}>
          <div className={styles.logo} />
          <BasicMenu />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <p className={styles.title} style={{ color: defaultSettings.primaryColor }}>
              {defaultSettings.title}
            </p>
            <Dropdown className={styles.dropdown} overlay={user_menu}>
              <a className='ant-dropdown-link'>
                {` ${sessionStorage.getItem('USER-NAME')}`}
                <Icon type='down' />
              </a>
            </Dropdown>
          </Header>
          <Content>
            <RouterTabs />
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
