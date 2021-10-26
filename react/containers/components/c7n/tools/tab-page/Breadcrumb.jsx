/* eslint-disable consistent-return */
import React, {
  Component, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import queryString from 'query-string';
import { withRouter, Link } from 'react-router-dom';
import classNames from 'classnames';
import { Breadcrumb as Bread, Icon } from 'choerodon-ui';
import useTheme from '@/hooks/useTheme';
import { Context } from './PageWrap';
import './style/Bread.less';

const { Item } = Bread;

const Breadcrumb = ({
  title, AppState, HeaderStore, MenuStore, history, custom, children, extraNode, ...props
}) => {
  const { isTab } = useContext(Context);
  const [theme] = useTheme();
  const isTheme4 = useMemo(() => theme === 'theme4', [theme]);

  function getOrganization() {
    const { currentMenuType: { organizationId } } = AppState;
    const currentData = toJS(HeaderStore.getOrgData) || [];
    const orgObj = currentData.find((v) => String(v.id) === organizationId) || {};
    return orgObj;
  }

  function getMenuParents() {
    return MenuStore.activeMenuParents;
  }

  function getCurrentMenu() {
    return MenuStore.activeMenu;
  }

  function getMenuLink(route) {
    const {
      id, name, type, organizationId, category,
    } = AppState.currentMenuType;
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
    return `${route}${search}`;
  }

  function renderName() {
    const { currentMenuType: { type, name }, isTypeUser } = AppState;
    if (isTypeUser) {
      return (
        <Item className={classNames({
          'c7ncd-theme4-bread-menu': isTheme4,
          'c7n-breadcrumb-link': !isTheme4,
        })}
        >
          {name}
        </Item>
      );
    }
    if (type === 'site' && history.location.pathname !== '/buzz/cooperate') {
      return (
        <Item className={classNames({
          'c7ncd-theme4-bread-menu': isTheme4,
          'c7n-breadcrumb-link': !isTheme4,
        })}
        >
          平台管理
        </Item>
      );
    }
    if (type === 'organization' || history.location.pathname === '/buzz/cooperate') {
      return (
        <Item className={classNames({
          'c7ncd-theme4-bread-menu': isTheme4,
          'c7n-breadcrumb-link': !isTheme4,
        })}
        >
          {getOrganization().name || ''}
        </Item>
      );
    }
    if (type === 'project') {
      return (
        <Item className={classNames({
          'c7ncd-theme4-bread-menu': isTheme4,
          'c7n-breadcrumb-link': !isTheme4,
        })}
        >
          {name}
        </Item>
      );
    }
  }

  function getArrayLast(arr) {
    if (Array.isArray(arr) && arr.length) {
      return arr[arr.length - 1];
    }
    return null;
  }

  function getRoute(menu) {
    if (menu.subMenus && menu.subMenus.length && menu.subMenus[0].type === 'tab') {
      return menu.subMenus[0].route;
    }
    return menu.route;
  }

  function renderMenus() {
    const currentMenu = getCurrentMenu();
    if (!currentMenu) return null;
    return (
      <Item className={classNames({
        'c7ncd-theme4-bread-menu': isTheme4,
        'c7n-breadcrumb-link': !isTheme4,
      })}
      >
        {
          getRoute(currentMenu) && title
            ? <Link to={getMenuLink(getRoute(currentMenu))}>{currentMenu.name}</Link>
            : <span>{currentMenu.name}</span>
        }
      </Item>
    );
  }

  const icon = isTheme4 ? <span style={{ width: 1, heigth: 12, background: 'rgba(15,19,88,0.65)' }} /> : <Icon type="keyboard_arrow_right" style={{ color: 'rgba(0, 0, 0, .54)', fontSize: '.2rem' }} />;

  if (custom) {
    return (
      <section
        className="page-breadcrumb"
        style={{
          marginBottom: isTab && !isTheme4 ? '33px' : 'auto',
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
      className={classNames('page-breadcrumb', {
        'theme4-page-breadcrumb': isTheme4,
      })}
      style={{
        marginBottom: isTab && !isTheme4 ? '33px' : 'auto',
      }}
    >
      <Bread separator={icon}>
        {
          isTheme4 ? (
            <>
              {renderMenus()}
              {/* {renderName()} */}
            </>
          ) : (
            <>
              {renderName()}
              {renderMenus()}
            </>
          )
        }
        {title ? <Item>{title}</Item> : null}
      </Bread>
      {extraNode || null}
    </section>
  );
};

export default withRouter(inject('AppState', 'HeaderStore', 'MenuStore')(observer(Breadcrumb)));
