/* eslint-disable */
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import NoMacth from '@/components/c7n-error-pages/404';
import Skeleton from '@/components/skeleton';

// @ts-expect-error
const routes:[string, React.ComponentType][] = __ROUTES__ || [];

const AutoRouter = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <CacheSwitch>
        {routes.map(([path, component]) => <Route path={path} component={component} />)}
        <CacheRoute path="*" component={NoMacth} />
      </CacheSwitch>
    </Suspense>
  );
}

export default AutoRouter;
