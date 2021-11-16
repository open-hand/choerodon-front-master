/* eslint-disable consistent-return */
import React, { FunctionComponent, useMemo } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { BreadcrumbProps } from './interface';
import './index.less';

const { Item } = Bread;

const prefixCls = 'page-breadcrumb';

const Breadcrumb:FunctionComponent<BreadcrumbProps> = (props) => {
  const {
    title,
    custom,
    children,
    extraNode,

    // ---to do ---
    AppState,
    MenuStore,
  } = props;

  const {
    currentMenuType: {
      id, name, type, organizationId, category,
    },
    isTypeUser,
  } = AppState;

  const currentMenu = MenuStore.activeMenu;

  const {
    subMenus,
    name: menuName,
    route,
  } = currentMenu || {};

  const currentRoute = useMemo(() => {
    if (subMenus && subMenus?.length && subMenus[0]?.type === 'tab') {
      return subMenus[0]?.route;
    }
    return route;
  }, [route, subMenus]);

  const currentLink = useMemo(() => {
    const searchMap = new URLSearchParams();
    switch (type) {
      case 'site':
        isTypeUser && searchMap.set('type', type);
        break;
      case 'organization':
      case 'project':
        searchMap.set('id', id);
        searchMap.set('type', type);
        searchMap.set('name', encodeURIComponent(name));
        searchMap.set('category', category);
        organizationId && searchMap.set('organizationId', organizationId);
        break;
      default:
        break;
    }
    return `${currentRoute}?${searchMap.toString()}`;
  }, [category, currentRoute, id, isTypeUser, name, organizationId, type]);

  function renderMenus() {
    if (!currentMenu) return null;
    return (
      <Item className={`${prefixCls}-menu`}>
        {
          currentRoute && title
            ? <Link to={currentLink}>{menuName}</Link>
            : <span>{menuName}</span>
        }
      </Item>
    );
  }

  const spliter = <span className={`${prefixCls}-spliter`} />;

  const renderBreadContent = () => {
    if (custom) {
      return children;
    }
    return (
      <>
        {renderMenus()}
        {title ? <Item>{title}</Item> : null}
      </>
    );
  };

  return (
    <section
      className={prefixCls}
    >
      <Bread separator={spliter}>
        {renderBreadContent()}
      </Bread>
      {extraNode || null}
    </section>
  );
};

export default inject('AppState', 'MenuStore')(observer(Breadcrumb));
