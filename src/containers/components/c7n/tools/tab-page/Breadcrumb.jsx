import React, { Component, useContext, useEffect } from 'react';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import queryString from 'query-string';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { Context } from './PageWrap';
import './style/Bread.less';

const { Item } = Bread;

const Breadcrumb = ({ title, AppState, HeaderStore, MenuStore, history, custom, children, extraNode, ...props }) => {
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

  function getCurrentMenu() {
    return MenuStore.activeMenu;
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

  function renderName() {
    const { currentMenuType: { type, name } } = AppState;
    if (type === 'site') return null;
    if (type === 'organization') return <Item>{getOrganization().name || ''}</Item>;
    if (type === 'project') {
      return (
        <React.Fragment>
          <Item>{getOrganization().name || ''}</Item>
          <Item>{name}</Item>
        </React.Fragment>
      );
    }
  }

  function renderMenus() {
    let menus = [];
    // const parentMenus = getMenuParents();
    const parentMenus = [];
    const currentMenu = getCurrentMenu();
    if (currentMenu) {
      menus = parentMenus.concat(currentMenu);
    }
    return menus.map(m => (
      <Item>
        {m.route ? <Link to={getMenuLink(m.route)}>{m.name}</Link> : <span>{m.name}</span>}
      </Item>
    ));
  }

  if (custom) {
    return (
      <section
        className="page-breadcrumb"
        style={{
          marginBottom: isTab ? '50px' : 'auto',
        }}
      >
        <Bread separator=">">
          {children}
        </Bread>
        {extraNode || null}
      </section>
    );
  }

  return (
    <section
      className="page-breadcrumb"
      style={{
        marginBottom: isTab ? '50px' : 'auto',
      }}
    >
      <Bread separator=">">
        {renderName()}
        {renderMenus()}
        {title ? <Item style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{title}</Item> : null}
      </Bread>
      {extraNode || null}
    </section>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(Breadcrumb));
