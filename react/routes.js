import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import nomatch from './containers/components/c7n/tools/error-pages/404';

const routes = JSON.parse(process.env.ROUTES).map((route) => (
  <Route
    path={route.key}
    component={React.lazy(route.path)}
  />
));
// console.log(process.env.ROUTES);
const AutoRouter = () => (
  <Suspense fallback={<span />}>
    <CacheSwitch>
      {routes}
      <CacheRoute path="*" component={nomatch} />
    </CacheSwitch>
  </Suspense>
);

export default AutoRouter;
