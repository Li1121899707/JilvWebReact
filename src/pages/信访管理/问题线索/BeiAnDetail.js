import React, { Component } from 'react'
import { Tabs } from 'antd'
import ChuBuHeShi from '../初步核实/ShenPiChengPi'
import LiAn from '../审查调查/LiAnShenChaChengPiShenPiTable'

const { TabPane } = Tabs

class BeiAnDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='content-box'>
        <Tabs>
          <TabPane tab='初核呈批表' key='1' style={{ overflow:'auto'}}>
            <ChuBuHeShi {...this.props} />
          </TabPane>
          <TabPane tab='立案呈批表' key='2'>
            <LiAn {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default BeiAnDetail
