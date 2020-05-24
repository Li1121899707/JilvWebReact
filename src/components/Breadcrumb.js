// 组织机构下拉树
import React from 'react'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { NavLink } from 'umi'
import routes from '../../config/router.config'

const Breadcrumbs = withBreadcrumbs(routes)(({ breadcrumbs }) => {
  // console.log(breadcrumbs)
  return (
    <div style={{ height: 45, lineHeight: '45px', paddingLeft: 30, backgroundColor: '#fff', borderTop: '1px solid #e8e8e8' }}>
      {breadcrumbs.map(({ match, breadcrumb }, index) => {
        if (match.url === '/') return null
        if(breadcrumb.props.children === 'Petition') return null
        const color = index === breadcrumbs.length - 1 ? '#333333' : '#8d8d8d'
        return (
          <span key={match.url}>
            <NavLink style={{ color }} to={match.url}>
              {breadcrumb}
            </NavLink>
            {index < breadcrumbs.length - 1 && <i>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;</i>}
          </span>
        )
      })}
    </div>
  )
})

export default Breadcrumbs
