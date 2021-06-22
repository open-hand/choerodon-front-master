// @ts-nocheck
import React, { useEffect, useMemo } from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import { noaccess as NoAccess, Permission } from '@/index';
import useQueryString from '@/hooks/useQueryString';
import Skeleton from '@/containers/components/c7n/master/skeleton';
// @ts-ignore
import { pendingRequest } from '@/containers/components/c7n/tools/axios';
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import Page from "@/containers/components/c7n/tools/page";
import Header from "@/containers/components/c7n/tools/page/Header";
import Breadcrumb from "@/containers/components/c7n/tools/tab-page/Breadcrumb";
import Content from "@/containers/components/c7n/tools/page/Content";

interface PermissionRouteProps extends RouteProps {
  service: string[] | ((type: 'project' | 'organization' | 'site') => string[]),
  enabledRouteChangedAjaxBlock: boolean,
}
const isFunction = (something: unknown): something is Function => typeof something === 'function';

const EmptyLoading = (props: {
  activeMenu: {
    name: string,
  }
}) => (
  <Page>
    <Header title={props.activeMenu.name || ''} />
    <Breadcrumb />
    <Content />
  </Page>
)

const PermissionRoute: React.FC<PermissionRouteProps> = inject('MenuStore')(observer(({ enabledRouteChangedAjaxBlock = true, service, ...rest }) => {
  const { type } = useQueryString();
  const location = useLocation();
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
        item.routeChangeCancel && item.cancel();
      });
    }
  },
  [location]);

  return (codes.length > 0)
    ? (
      <Permission
        service={codes}
        noAccessChildren={<NoAccess />}
        defaultChildren={<EmptyLoading activeMenu={rest.MenuStore.activeMenu} />}
      >
        {route}
      </Permission>
    )
    : (
      <Route
        {...rest}
      />
    );
}));
export default PermissionRoute;
