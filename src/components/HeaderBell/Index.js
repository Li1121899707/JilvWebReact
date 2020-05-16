import React from 'react'
import { Badge, Icon, Dropdown } from 'antd'
import { get, CancelAxiosRequest } from '@/utils/http'
import styles from './Index.less'
import NoticeList from './NoticeList'

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      sum: 0
    }
  }

  componentDidMount() {
    this.getNotices()
    this.timerID = setInterval(() => this.getNotices(), 60000)
    // this.interval = window.setInterval(this.getNotices , 60000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
    clearInterval(this.timerID)
    if (CancelAxiosRequest) CancelAxiosRequest()
    this.setState = (state, callback) => {}
  }


  getNotices = () => {
    get('todos/mine').then(res => {
      let sum = 0
      for (let i = 0; i < res.data.length; i++) {
        sum += res.data[i].number
      }
      this.setState({ data: res.data, sum })
    })
  }

  clearMsg = list => {
    const data = {
      ids: JSON.stringify(list)
    }
    get('todos/mine', data).then(res => {
      this.getNotices()
    })
  }

  clearDb = list => {
    const data = {
      ids: JSON.stringify(list)
    }
    get('todos/mine', data).then(res => {
      this.getNotices()
    })
  }

  render() {
    return (
      <div className={styles.noticeButton} style={{ float: 'right', marginRight: 30 }}>
        {/* <Dropdown overlay={<NoticeList data={this.state.data} propsUrl={this.props} clearMsg={this.clearMsg} clearDb={this.clearDb} />}>
          <Badge className='badge' count={this.state.sum}>
            <Icon type='bell' className='icon' style={{ fontSize: 18, color: 'Gray' }} />
          </Badge>
        </Dropdown> */}
      </div>
    )
  }
}
export default Index
