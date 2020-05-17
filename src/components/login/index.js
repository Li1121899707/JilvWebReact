import React, { Component } from 'react'
import { Button, Form, Icon, Input, Spin } from 'antd'
import router from 'umi/router'
import { post } from '@/utils/http'
import style from './index.less'

const FormItem = Form.Item
class Login extends Component {
  state = { loading: false }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        post('authenticate', values).then(res => {
          const data = res.data
          sessionStorage.clear() // 重新登录时，需要清楚刚才的
          sessionStorage.setItem('token', data.id_token)
          sessionStorage.setItem('USERNAME', data.userName)
          router.push('/admin')
        })
      }
    })
  }

  render() {
    let { getFieldDecorator } = this.props.form

    const antIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    return (
      <div className={style.Login}>
        <div className={style.loginBox}>
          <div className={style.title}>
            <h1>纪检监察系统登录</h1>
          </div>
          <div className={style.content}>
            <Form onSubmit={this.handleSubmit} className='login-form'>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(<Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='用户名' />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(<Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='密码' />)}
              </FormItem>
              <FormItem>
                <Spin spinning={this.state.loading} indicator={antIcon}>
                  <Button type='primary' htmlType='submit' className={style.loginFormButton}>
                    登录
                  </Button>
                </Spin>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
const WrappedNormalLoginForm = Form.create()(Login)
export default WrappedNormalLoginForm
