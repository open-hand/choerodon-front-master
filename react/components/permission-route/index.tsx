import React, { useEffect, useMemo } from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import { noaccess as NoAccess, Permission } from '@/index';
import useQueryString from '@/hooks/useQueryString';
import Skeleton from '@/containers/components/c7n/master/skeleton';
// @ts-ignore
import { pendingRequest } from '@/containers/components/c7n/tools/axios';

interface PermissionRouteProps extends RouteProps {
  service: string[] | ((type: 'project' | 'organization' | 'site') => string[]),
  enabledRouteChangedAjaxBlock: boolean,
}
const isFunction = (something: unknown): something is Function => typeof something === 'function';

const PermissionRoute: React.FC<PermissionRouteProps> = ({ enabledRouteChangedAjaxBlock = true, service, ...rest }) => {
  const location = useLocation();
  const { type } = useQueryString();
  const codes = useMemo(() => (isFunction(service) ? service(type) : (service || [])), [service, type]);
  const route = (
    <Route
      {...rest}
    />
  );

  useEffect(() => function () {
    // @ts-ignore
    if (enabledRouteChangedAjaxBlock && pendingRequest) {
    // @ts-ignore
      pendingRequest.forEach((item:any) => {
        item.cancel();
      });
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
