import { Avatar, List, Tabs } from 'antd'
import React from 'react'
import { router } from 'umi'
import styles from './NoticeList.less'
import { uTCToDate } from '@/utils/common'
import { createHashHistory } from 'history'
const history = createHashHistory()
const { TabPane } = Tabs
class NoticeList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            data:this.props.data
        }

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.data) {
            return {
                data: nextProps.data,
            }
        }
        return null
    }
    clearMsg=()=>{
        let arr = []
        for(let item of this.tz){
            arr.push(item.id)
        }
        this.props.clearMsg(arr)
    }
    clearDb=()=>{
        let arr = []
        for(let item of this.db){
            arr.push(item.id)
        }
        this.props.clearDb(arr)
    }

    toPage=(item)=>{
        const {type} = item
      switch (type) {
        case '问题线索' :
          router.push(`/admin/petition/clue/clueList`)
          break
        case '谈话函询' :
          router.push(`/admin/petition/talk/list`)
          break
        case '初步核实' :
          router.push(`/admin/petition/check/list`)
          break
        case '审查调查-立案准备' :
          router.push(`/admin/petition/investigation/list`)
          break
        case '审查调查-立案中' :
          router.push(`/admin/petition/investigation/liAnZhongList`)
          break
        case '审查调查-立案后续' :
          router.push(`/admin/petition/investigation/liAnHouXuList`)
          break
        case '审理管理' :
          router.push(`/admin/petition/management/list`)
          break
        case '公文流转' :
          router.push(`/admin/circulation/index`)
          break
        case '信访件' :
          router.push(`/admin/letters/list`)
          break
      }
        // switch (sonType) {
        //     case '自评':   //需要自评
        //         history.push(`/shengju/nk/pingjialist/${module}/sendZP`)
        //         break
        //     case '复评':   // 需要复评
        //         history.push(`/shengju/nk/pingjialist/${module}/approvezp/${unodoId}`)
        //         break
        //     case '样表':   // 评价样表审核
        //         history.push(`/shengju/nk/tableapprovechange/${module}/${unodoId}`)
        //         break
        //     default:  //null   流程审核
        //         if(module==='预算'){
        //             history.push(`/shengju/nk/tableapprove/${unodoId}/${module}`)
        //         }else if(module === '合同'){
        //             history.push(`/shengju/nk/hetong/listapprove/${unodoId}`)
        //
        //         }else if(module === '采购'){
        //             history.push(`/shengju/nk/listapprove/${unodoId}`)
        //
        //         }else if(module === '资产'){
        //             history.push(`/shengju/nk/listapprove/${unodoId}`)
        //         }
        //
        //         break
        // }

    }

    render(){
        const {data} = this.state
        this.tz = []
        this.db = []
        console.log(data)
        for(let item of data){
          this.db.push(item)
        }
        return (
            <div className='popover'>
                <Tabs defaultActiveKey="1">
                    {/*<TabPane tab="通知" key="1">*/}
                    {/*    <List className={styles.list}*/}
                    {/*        dataSource={this.tz}*/}
                    {/*        renderItem={(item, i) => {*/}

                    {/*            return (*/}
                    {/*                <List.Item*/}
                    {/*                    className={styles.item}*/}
                    {/*                    key={item.key || i}*/}
                    {/*                >*/}
                    {/*                    <List.Item.Meta*/}
                    {/*                        className={styles.meta}*/}
                    {/*                        avatar={*/}
                    {/*                            <Avatar className={styles.avatar} size={'large'} style={{verticalAlign: 'middle',backgroundColor:'#606D80'}} >*/}
                    {/*                                {item.module}*/}
                    {/*                            </Avatar>*/}
                    {/*                        }*/}
                    {/*                        title={*/}
                    {/*                            <div className={styles.title}>*/}
                    {/*                                {item.title}*/}
                    {/*                                <div className={styles.extra}>{item.extra}</div>*/}
                    {/*                            </div>*/}
                    {/*                        }*/}
                    {/*                        description={*/}
                    {/*                            <div>*/}
                    {/*                                <div className={styles.description}>{item.note}</div>*/}
                    {/*                                <div className={styles.datetime}>{uTCToDate(item.createTime)}</div>*/}
                    {/*                            </div>*/}
                    {/*                        }*/}
                    {/*                    />*/}
                    {/*                </List.Item>*/}
                    {/*                )*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*    {this.tz.length > 0 ? <div className={styles.bottomBar}>*/}
                    {/*            <div onClick={this.clearMsg}>*/}
                    {/*                清空*/}
                    {/*            </div>*/}

                    {/*        </div> : null}*/}
                    {/*</TabPane>*/}
                    <TabPane tab="待办" key="3">
                        <List className={styles.list}
                              dataSource={this.db}
                              renderItem={(item, i) => {
                                  return (
                                      <List.Item
                                          className={styles.item}
                                          key={item.key || i}
                                          onClick={()=>{this.toPage(item)}}
                                      >
                                          <List.Item.Meta
                                              className={styles.meta}
                                              // avatar={<Avatar className={styles.avatar} size={'large'} style={{verticalAlign: 'middle',backgroundColor:'#606D80'}} >
                                              //     {item.module}
                                              // </Avatar>}
                                              title={
                                                  <div className={styles.title}>
                                                      {item.type}页面有{item.number}条消息待处理
                                                      <div className={styles.extra}>{item.extra}</div>
                                                  </div>
                                              }
                                              // description={
                                              //     <div>
                                              //         <div className={styles.description}>{item.note}</div>
                                              //         <div className={styles.datetime}>{uTCToDate(item.createTime)}</div>
                                              //     </div>
                                              // }
                                          />
                                      </List.Item>
                                  )
                              }}
                        />
                        {/*{this.db.length > 0 ? <div className={styles.bottomBar}>*/}
                        {/*    <div onClick={this.clearDb}>*/}
                        {/*        清空*/}
                        {/*    </div>*/}
                        {/*</div> : null}*/}
                    </TabPane>
                </Tabs>
            </div>
        )
    }

}


export default NoticeList
