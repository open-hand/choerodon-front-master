import React, { useEffect, useMemo } from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import { noaccess as NoAccess, Permission } from '@/index';
import useQueryString from '@/hooks/useQueryString';
import Skeleton from '@/containers/components/c7n/master/skeleton';
import { axiosRoutesCancel } from '@/containers/components/c7n/tools/axios/instances';

interface PermissionRouteProps extends RouteProps {
  service: string[] | ((type: 'project' | 'organization' | 'site') => string[]),
  enabledRouteChangedAjaxBlock: boolean,
}
const isFunction = (something: unknown): something is Function => typeof something === 'function';

const PermissionRoute: React.FC<PermissionRouteProps> = ({ enabledRouteChangedAjaxBlock = true, service, ...rest }) => {
  const { type } = useQueryString();
  const location = useLocation();
  const codes = useMemo(() => (isFunction(service) ? service(type) : (service || [])), [service, type]);
  const route = (
    <Route
      {...rest}
    />
  );

  useEffect(() => function () {
    if (enabledRouteChangedAjaxBlock && axiosRoutesCancel.size) {
      axiosRoutesCancel.cancelAllRequest();
    }
  },
  [location]);

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
