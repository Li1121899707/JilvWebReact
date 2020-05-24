import moment from 'moment'
import pathToRegexp from 'path-to-regexp'
import routers from '../../config/router.config'

// 通过 pathname 获取 pathname 对应到路由描述信息对象
function getTitleByPathname(path) {
  let title = ''
  const searchTit = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (path.indexOf(arr[i].path) >= 0 && arr[i].routes) searchTit(arr[i].routes)
      // pathToRegexp(arr[i].path,[],{end:true});
      if (arr[i].path && pathToRegexp(arr[i].path).exec(path)) {
        title = arr[i].name
        break
      }
    }
  }
  searchTit(routers)
  return title
}

function dateToUTC(date) {
  return moment(date)
    .hour(+8)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toISOString() // 2019-03-20T16:00:00.000Z    时分秒 取 0
}
function uTCToDate(utc_datetime) {
  return moment(utc_datetime)
    .utc()
    .utcOffset(+8)
    .format('YYYY-MM-DD HH:mm:ss')
}

function getCookie(name) {
  let arr
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)

  if (arr == document.cookie.match(reg)) return decodeURIComponent(arr[2])
  return null
}
function setCookie(name, value) {
  const Days = 30
  const exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30)
  document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`
}

function delCookie(name) {
  const exp = new Date()

  exp.setTime(exp.getTime() - 1)

  const cval = getCookie(name)

  if (cval !== null) {
    document.cookie = `${name}=${cval};expires=${exp.toUTCString()}`
  }
}

function isLogin() {
  // if(!sessionStorage.getItem("ORG-NAME") || !sessionStorage.getItem("USER-NAME")){
  //     alert("请登录！");
  //     window.location.href = "#/";
  // }
}

/**
 * 和Table一样 需要特殊渲染添加expRender属性，参数是一行的对象
 * @param columns
 * @param dataSource
 * @param name 导出文件名
 */

function tableToCsv(columns, dataSource, name = '导出文件') {
  let str = ''
  columns.forEach(item => {
    str += `${item.title},`
  })
  str = `${str.substr(0, str.length - 1)}\n`
  dataSource.forEach(data => {
    // data是数组ds中每一个json对象
    columns.forEach(item => {
      // 对于每一个json对象需要把行列对齐
      for (const dataItem in data) {
        if (item.dataIndex === dataItem) {
          if (item.expRender) {
            str += `${`${item.expRender(data)}\t`},`
          } else {
            str += `${`${data[dataItem]}\t`},`
          }
          break
        }
      }
    })
    str += '\n'
  })
  const uri = `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(str)}`

  // let blob = new Blob([window.atob(decodeURIComponent(uri))], {type: "text/csv"});
  // //因为后台base_64编码了,这里window.atob解码一下
  //       window.navigator.msSaveBlob(blob,name);
  //
  // 通过创建a标签实现
  const link = document.createElement('a')
  link.href = uri
  // 对下载的文件命名
  link.download = `${name}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 和Table一样 需要特殊渲染添加expRender属性，参数是一行的对象,导出xls
 * @param columns
 * @param dataSource
 * @param name 导出文件名
 */

function tableToXls(columns, dataSource, name = '导出文件') {
  let str = '<tr>'
  columns.forEach(item => {
    str += `<td>${item.title}</td>`
  })
  str += '</tr>'
  dataSource.forEach(data => {
    // data是数组ds中每一个json对象
    str += '<tr>'
    columns.forEach(item => {
      // 对于每一个json对象需要把行列对齐
      for (const dataItem in data) {
        if (item.dataIndex === dataItem) {
          if (item.expRender) {
            str += `<td>${`${item.expRender(data)}\t`}</td>`
          } else {
            str += `<td>${`${data[dataItem]}\t`}</td>`
          }
          break
        }
      }
    })
    str += '</tr>'
  })
  // Worksheet名
  const worksheet = 'Sheet1'
  const uri = 'data:application/vnd.ms-excel;base64,'

  // 下载的表格模板数据
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <meta charset="utf-8">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`
  // 下载模板
  window.location.href = uri + base64(template)
}
// 输出base64编码
function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)))
}

function isShowPane(auth) {
  return window.permissions && window.permissions.indexOf(auth) > -1
}

export const formatNum = (s, n) => {
  // 保留小数点两位
  if (!s) return '0.00'
  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  let l = s
      .split('.')[0]
      .split('')
      .reverse(),
    r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
  }
  if (t.charAt(t.length - 1) === '-' && t.charAt(t.length - 2) === ',') {
    t = t.substring(0, t.length - 2) + t.substring(t.length - 1, t.length)
  }
  return (
    t
      .split('')
      .reverse()
      .join('') +
    '.' +
    r
  )
}

function formatChinese(num) {
  let number = '一'
  switch (num + 1) {
    case 1:
      number = '一'
      break
    case 2:
      number = '二'
      break
    case 3:
      number = '三'
      break
    case 4:
      number = '四'
      break
    case 5:
      number = '五'
      break
    case 6:
      number = '六'
      break
    case 7:
      number = '七'
      break
    case 8:
      number = '八'
      break
    case 9:
      number = '九'
      break
    default:
      number = ''
      break
  }
  return number
}

function exportFiles(url, name) {
  console.log(url)
  // url 为需要访问的地址，name为下载文件的名字
  // 本方法用于需要携带token下载文件的接口
  // 原生ajax 访问 携带token ， a 标签下载
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  // console.log(url)
  //设置请求头参数的方式,如果没有可忽略此行代码
  xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
  //设置响应类型为 blob   xhr.open必须为 异步
  xhr.responseType = 'blob'
  //关键部分
  xhr.send()
  xhr.onload = function(e) {
    //如果请求执行成功
    if (this.status == 200) {
      const blob = this.response
      const a = document.createElement('a')
      // blob.type = "application/octet-stream";
      const pdfUrl = window.URL.createObjectURL(blob)
      // console.log(pdfUrl)
      a.href = pdfUrl
      a.download = name //设置下载文件的名字
      document.body.appendChild(a) // 火狐浏览器 必须把元素插入body中
      a.click()
      document.body.removeChild(a)
      //释放之前创建的URL对象
      window.URL.revokeObjectURL(url)
    }
  }
}


export { dateToUTC, uTCToDate, getCookie, exportFiles, delCookie, setCookie, isLogin, tableToCsv, tableToXls, isShowPane, formatChinese }
export default ''
