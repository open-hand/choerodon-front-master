import React, { useEffect, useMemo } from 'react';
import {
  Route, useLocation,
} from 'react-router-dom';
import NoAccess from '@/components/c7n-error-pages/403';
import { Permission } from '@/components/permission';
import useQueryString from '@/hooks/useQueryString';
import Skeleton from '@/components/skeleton';
import { axiosRoutesCancel } from '@/components/axios/instances';
import { PermissionRouteProps } from './interface';

const isFunction = (something: unknown): something is Function => typeof something === 'function';

const PermissionRoute: React.FC<PermissionRouteProps> = ({ enabledRouteChangedAjaxBlock = true, service, ...rest }) => {
  const { type } = useQueryString();
  const location = useLocation();
  const codes = useMemo(() => (isFunction(service) ? service(type as any) : (service || [])), [service, type]);
  const route = (
    <Route
      {...rest}
    />
  );

  useEffect(() => function () {
    if (enabledRouteChangedAjaxBlock && axiosRoutesCancel.size) {
      axiosRoutesCancel.cancelAllRequest();
    }
  }, [location.pathname]);

  return (codes.length > 0)
    ? (
      <Permission
        service={codes}
        noAccessChildren={<NoAccess />}
        defaultChildren={<Skeleton />}
      >
        {route}
      </Permission>
    )
    : (
      <Route
        {...rest}
      />
    );
};
export default PermissionRoute;
