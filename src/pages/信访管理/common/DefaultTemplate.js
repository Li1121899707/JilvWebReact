import React, { Component } from 'react'
import styles from '@/pages/信访管理/Index.less'
import TableInput from '@/pages/信访管理/common/TableInput'
import moment from 'moment'

class DefaultTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { dataSource } = this.props
    return (
      <>
        <tr>
          <td className={styles.label}>线索来源</td>
          <td className={styles.val} colSpan={3}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xianSuoLaiYuan} />
          </td>
          <td className={styles.label}>线索编号</td>
          <td className={styles.val}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xuHao} />
          </td>
        </tr>
        <tr>
          <td className={styles.label}>收件日期</td>
          <td className={styles.val}>
            <TableInput
              propsMode='show'
              data={dataSource.wenTiXianSuo_shouDaoShiJian ? moment(dataSource.wenTiXianSuo_shouDaoShiJian).format('YYYY-MM-DD') : ''}
            />
          </td>
          <td className={styles.label}>反应人</td>
          <td className={styles.val}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRen} />
          </td>
          <td className={styles.label}>性别</td>
          <td className={styles.val}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_xingBie} />
          </td>
        </tr>
        <tr>
          <td className={styles.label}>政治面貌</td>
          <td className={styles.val}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_zhengZhiMianMao} />
          </td>
          <td className={styles.label}>联系电话</td>
          <td className={styles.val}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_dianHua} />
          </td>
          <td className={styles.label}>通信地址</td>
          <td className={styles.val}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_diZhi} />
          </td>
        </tr>
        <tr>
          <td className={styles.label}>工作单位</td>
          <td className={styles.val} colSpan={2}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenDanWei} />
          </td>
          <td className={styles.label}>职务</td>
          <td className={styles.val} colSpan={3}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingRenZhiWu} />
          </td>
        </tr>
        <tr>
          <td className={styles.label}>被反映人</td>
          <td className={styles.val} colSpan={7}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRen} />
          </td>
        </tr>
        <tr>
          <td className={styles.label}>工作单位</td>
          <td className={styles.val} colSpan={2}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenDanWei} />
          </td>
          <td className={styles.label}>职务</td>
          <td className={styles.val} colSpan={3}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_beiFanYingRenZhiWu} />
          </td>
        </tr>
        <tr>
          <td className={styles.label}>反应主要问题</td>
          <td className={styles.val} colSpan={7}>
            <TableInput propsMode='show' data={dataSource.wenTiXianSuo_fanYingZhuYaoWenTi} />
          </td>
        </tr>
      </>
    )
  }
}

export default DefaultTemplate
