import React, { useEffect, useMemo } from 'react';
import {
  Route, useLocation,
} from 'react-router-dom';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import NoAccess from '@/components/c7n-error-pages/403';
import { Permission } from '@/components/permission';
import useQueryString from '@/hooks/useQueryString';
import Skeleton from '@/components/skeleton';
import { axiosRoutesCancel } from '@/components/axios/instances';
import { PermissionRouteProps } from './interface';

const isFunction = (something: unknown): something is Function => typeof something === 'function';

const PermissionRoute: React.FC<any> = ({ enabledRouteChangedAjaxBlock = true, service, ...rest }) => {
  const { type } = useQueryString();
  const location = useLocation();
  const codes = useMemo(() => (isFunction(service) ? service(type as any) : (service || [])), [service, type]);
  const route = (
    <Route
      {...rest}
    />
  );

  const renderHasCode = () => {
    const {
      AppState: {
        menuType: {
          type: myType,
        },
      },
      MenuStore: {
        getMenuData,
        activeMenuRoot,
        activeMenu,
      },
      path,
    } = rest;
    // if (activeMenu) {
    //   let flag = false;
    //   const menuRoot = activeMenuRoot[myType];
    //   const submenus = menuRoot?.subMenus;
    //   flag = submenus?.find((item: any) => item.route === path);
    //   if (flag) {
    //     return route;
    //   }
    //   return (
    //     <Permission
    //       service={codes}
    //       noAccessChildren={<NoAccess />}
    //       defaultChildren={<Skeleton />}
    //     >
    //       {route}
    //     </Permission>
    //   );
    // }
    if (activeMenu) {
      return route;
    }
    return (
      <Permission
        service={codes}
        noAccessChildren={<NoAccess />}
        defaultChildren={<Skeleton />}
      >
        {route}
      </Permission>
    );
  };

  useEffect(() => function () {
    if (enabledRouteChangedAjaxBlock && axiosRoutesCancel.size) {
      axiosRoutesCancel.cancelAllRequest();
    }
  }, [location.pathname]);

  return (codes.length > 0)
    ? renderHasCode()
    : (
      <Route
        {...rest}
      />
    );
};
export default inject('MenuStore', 'AppState')(observer(PermissionRoute));
