import React, { useMemo } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { noaccess as NoAccess, Permission } from '@/index';
import useQueryString from '@/hooks/useQueryString';

interface PermissionRouteProps extends RouteProps {
  service: string[] | ((type: 'project' | 'organization' | 'site') => string[])
}
const isFunction = (something: unknown): something is Function => typeof something === 'function';
const PermissionRoute: React.FC<PermissionRouteProps> = ({ service, ...rest }) => {
  const { type } = useQueryString();
  const codes = useMemo(() => (isFunction(service) ? service(type) : service), [service, type]);
  const route = (
    <Route
      {...rest}
    />
  );
  return (codes.length > 0)
    ? (
      <Permission
        service={codes}
        noAccessChildren={<NoAccess />}
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
