import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import nomatch from './containers/components/c7n/tools/error-pages/404';

// const routes = [
//   ['work-list', () => import('./routes/WorkList')],
//   ['storyMap', () => import('./routes/StoryMap')],
// ];
// eslint-disable-next-line no-undef
const routes = __ROUTES__;
const AutoRouter = () => (
  <Suspense fallback={<span />}>
    <CacheSwitch>
      {routes.map(([path, component]) => <Route path={path} component={React.lazy(component)} />)}
      <CacheRoute path="*" component={nomatch} />
    </CacheSwitch>
  </Suspense>
);

export default AutoRouter;
