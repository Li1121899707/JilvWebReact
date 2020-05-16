// 组织机构下拉树
import React, { Component } from 'react'
import { router, withRouter } from 'umi'

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    const { type } = props.match.params
    const { basicId } = props.match.params
    const url = `/admin/archives/${type}/${basicId}`
    // 详情时候 多三个菜单
    this.showListMore = [
      {
        nav: '谈话档案',
        path: `${url}/dangan`
      },
      {
        nav: '线索处置',
        path: `${url}/chuzhi`
      },
      {
        nav: '违规违纪',
        path: `${url}/weigui`
      }
    ]
    this.navList = [
      {
        nav: '基本情况',
        path: `${url}/basicinfo`
      },
      {
        nav: '收入情况',
        path: `${url}/income`,
        child: [
          {
            nav: '工资及各类奖金、津贴、补贴'
          },
          {
            nav: '从事讲学、写作、咨询、审稿、书画等劳务所得'
          }
        ]
      },
      {
        nav: '婚姻情况',
        path: `${url}/marriage`
      },
      {
        nav: '家属从业情况',
        path: `${url}/congyeinfo`,
        child: [
          {
            nav: '配偶、子女及其配偶从业情况'
          },
          {
            nav: '除配偶、子女及其配偶外其他近亲属在系统内任职从业情况'
          }
        ]
      },
      {
        nav: '资产情况',
        path: `${url}/zichaninfo`,
        child: [
          {
            nav: '本人、配偶、共同生活的子女为所有权人或者共有人的房产情况'
          },
          {
            nav: '本人、配偶、共同生活的子女投资或者以其他方式持有股票的情况'
          },
          {
            nav: '本人、配偶、共同生活的子女在系统内法人机构投资入股情况'
          },
          {
            nav: '本人、配偶、共同生活的子女投资或者以其他方式持有基金的情况'
          },
          {
            nav: '本人、配偶、共同生活的子女投资或者以其他方式持有投资型保险的情况'
          },
          {
            nav: '配偶、子女及其配偶经商办企业的情况'
          },
          {
            nav: '本人、配偶、共同生活的子女在国（境）外的存款情况'
          },
          {
            nav: '本人、配偶、共同生活的子女在国（境）外的投资情况'
          }
        ]
      },
      {
        nav: '出国情况',
        path: `${url}/goabroad`,
        child: [
          {
            nav: '本人持有普通护照的情况'
          },
          {
            nav: '本人因私出国的情况'
          },
          {
            nav: '本人持有往来港澳通行证、因私持有大陆居民往来台湾通行证的情况'
          },
          {
            nav: '本人因私往来港澳、台湾的情况'
          },
          {
            nav: '配偶、子女虽未移居国（境）外，但连续在国（境）外工作，生活一年以上的情况'
          }
        ]
      },
      {
        nav: '刑责情况',
        path: `${url}/criminal`
      },
      {
        nav: '其他重大事项',
        path: `${url}/importantinfo`
      }
    ]
  }

  render() {
    const style = {
      width: 100,
      height: 35,
      lineHeight: '35px',
      backgroundColor: '#98d095',
      cursor: 'pointer',
      display: 'inline-block',
      borderRadius: '5px 5px 0 0',
      textAlign: 'center',
      margin: '5px 3px 0 0',
      fontSize: 14,
      color: '#1f1f1f'
    }
    const styleActive = {
      ...style,
      color: '#056535',
      backgroundColor: '#fff'
    }
    const list = this.props.match.params.type === 'show' ? this.navList.concat(this.showListMore) : this.navList
    const { pathname } = this.props.location
    return (
      <div>
        {list.map((item, i) => {
          return (
            <div key={i} style={pathname.indexOf(item.path) !== -1 ? styleActive : style} onClick={() => router.push(`${item.path}`)}>
              {item.nav}
            </div>
          )
        })}
      </div>
    )
  }
}
export default withRouter(Nav)
