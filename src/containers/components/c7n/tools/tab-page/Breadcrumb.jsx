import React, { Component, useContext, useEffect } from 'react';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import queryString from 'query-string';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { Context } from './PageWrap';
import './style/Bread.less';

const { Item } = Bread;

const Breadcrumb = ({ title = 'Choerodon猪齿鱼平台', AppState, HeaderStore, MenuStore, history, ...props }) => {
  const { isTab } = useContext(Context);

  function getOrganization() {
    const { currentMenuType: { orgId } } = AppState;
    const currentData = toJS(HeaderStore.getOrgData) || [];
    const orgObj = currentData.find(v => String(v.id) === orgId) || {};
    return orgObj;
  }

  function getMenuParents() {
    return MenuStore.activeMenuParents;
  }

  function getMenuLink(route) {
    const { orgId } = queryString.parse(history.location.search);
    const { id, name, type, organizationId, category } = AppState.currentMenuType;
    let search = '';
    switch (type) {
      case 'site':
        if (AppState.isTypeUser) {
          search = '?type=site';
        }
        break;
      case 'organization':
      case 'project':
        search = `?type=${type}&id=${id}&name=${encodeURIComponent(name)}&category=${category}`;
        if (organizationId) {
          search += `&organizationId=${organizationId}`;
        }
        break;
      default:
    }
    return `${route}${search}${search === '' ? `?orgId=${orgId}` : `&orgId=${orgId}`}`;
  }

  function renderOrganization() {
    return <Item>{getOrganization().name || ''}</Item>;
  }

  function renderMenus() {
    const menus = getMenuParents();
    return menus.map(m => (
      <Item>
        {m.route ? <Link to={getMenuLink(m)}>{m.name}</Link> : <span>{m.name}</span>}
      </Item>
    ));
  }

  return (
    <section
      className="page-breadcrumb"
      style={{
        marginBottom: isTab ? '50px' : 'auto',
      }}
    >
      <Bread separator=">">
        {renderOrganization()}
        {renderMenus()}
        <Item style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{title}</Item>
      </Bread>
    </section>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(Breadcrumb));
