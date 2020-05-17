/*
 * @Author: lixiang
 * @Email: 619419059@qq.com
 * @Date: 2019-08-27 11:50:25
 * @Last Modified by: lixiang
 * @Last Modified time: 2019-08-28 15:54:09
 * @Description: Description
 */

import React, { Component } from 'react'
import { Button } from 'antd'
import 'moment/locale/zh-cn'
import Nav from '@/pages/文件上传/common/Nav'
import { get, post } from '@/utils/http'
import {exportFiles} from "@/utils/common";

export default class ArchivesLayout extends Component {
  getPdf = () => {
    const basicId = this.props.match.params.basicId
    get(`basic-infos/${basicId}`).then(res => {
      this.download(res.data.idCard)
    })
  }

  download = id => {
    post(`pdf/exportPdf?idCard=${id}`).then(res => {
      exportFiles(`${window.server}/api/pdf/getPdf/${res.data}`,res.data)
    })
  }

  render() {
    return (
      <div style={{ margin: '5px 0 0 10px' }}>
        <div style={style}>
          <p style={style_p}>个人廉情档案</p>
          {this.props.match.params.type === 'show' ? (
            <Button type='link' onClick={this.getPdf}>
              个人廉情报告
            </Button>
          ) : (
            ''
          )}
        </div>
        <Nav />
        {this.props.children}
      </div>
    )
  }
}

const style = {
  height: 50,
  padding: '10px 0 0 15px',
  backgroundColor: '#fff'
}
const style_p = {
  height: 22,
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  borderLeft: '4px solid #056535',
  paddingLeft: 10,
  marginRight: 890,
  display: 'inline-block'
}
