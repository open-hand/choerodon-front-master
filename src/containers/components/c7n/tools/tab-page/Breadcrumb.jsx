import React, { Component, useContext, useEffect } from 'react';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import queryString from 'query-string';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb as Bread, Icon } from 'choerodon-ui';
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
    if (type === 'site') return <Item>平台管理</Item>;
    if (type === 'organization') return <Item>{getOrganization().name || ''}</Item>;
    if (type === 'project') return <Item>{name}</Item>;
  }

  function getArrayLast(arr) {
    if (Array.isArray(arr) && arr.length) {
      return arr[arr.length - 1];
    } else {
      return null;
    }
  }

  function renderMenus() {
    let menus = [];
    // const parentMenus = getMenuParents();
    const parentMenus = [];
    let currentMenu = getCurrentMenu();
    if (currentMenu && currentMenu.type === 'tab') {
      currentMenu = getArrayLast(getMenuParents());
    }
    if (currentMenu) {
      menus = parentMenus.concat(currentMenu);
    }
    return menus.map(m => (
      <Item>
        {m.route ? <Link to={getMenuLink(m.route)}>{m.name}</Link> : <span>{m.name}</span>}
      </Item>
    ));
  }

  const icon = <Icon type="keyboard_arrow_right" style={{ color: 'rgba(0, 0, 0, .65)', fontSize: '.2rem' }} />;

  if (custom) {
    return (
      <section
        className="page-breadcrumb"
        style={{
          marginBottom: isTab ? '50px' : 'auto',
        }}
      >
        <Bread separator={icon}>
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
      <Bread separator={icon}>
        {renderName()}
        {renderMenus()}
        {title ? <Item className="title">{title}</Item> : null}
      </Bread>
      {extraNode || null}
    </section>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(Breadcrumb));
