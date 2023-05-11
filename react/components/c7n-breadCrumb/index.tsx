/* eslint-disable consistent-return */
import React, { FunctionComponent, useMemo } from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Breadcrumb as Bread } from 'choerodon-ui';
import { BreadcrumbProps } from './interface';
import './index.less';
import getRoutePath from '@/utils/getRoutePath';
import useShouldHiddenMenu from '@/hooks/useShouldHiddenMenu';

const { Item } = Bread;

const prefixCls = 'c7ncd-breadcrumb';

const Breadcrumb:FunctionComponent<BreadcrumbProps> = (props) => {
  const {
    title,
    custom,
    children,
    extraNode,

    // ---to do ---
    MenuStore,
    backParams,
  } = props;

  // 如果当前的路由匹配到了需要隐藏菜单的路由页面
  const hiddenMenu = useShouldHiddenMenu();

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

  const currentLink = useMemo(() => getRoutePath(route), [route]);

  function renderMenus() {
    if (!currentMenu || hiddenMenu) return null;
    return (
      <Item className={`${prefixCls}-menu`}>
        {
          currentRoute && title
            ? (
              <Link to={{
                pathname: currentLink?.pathname,
                search: `${currentLink?.search}${backParams || ''}`,
              }}
              >
                {menuName}
              </Link>
            )
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

export default inject('MenuStore')(observer(Breadcrumb));
