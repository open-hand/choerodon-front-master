/* eslint-disable */
import React, { Suspense, useState } from 'react';
import { Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import nomatch from './containers/components/c7n/tools/error-pages/404';
import Skeleton from './containers/components/c7n/master/skeleton/index.js';

// const routes = [
//   ['work-list', () => import('./routes/WorkList')],
//   ['storyMap', () => import('./routes/StoryMap')],
// ];

__INSTALLS__;
// eslint-disable-next-line no-undef
const routes = __ROUTES__;
const AutoRouter = () => {
  return (
    // <CacheSwitch>
    //   {routes.map(([path, component]) => <Route path={path} component={React.lazy(component)} />)}
    //   <CacheRoute path="*" component={nomatch} />
    // </CacheSwitch>
    <Suspense fallback={<Skeleton />}>
      <CacheSwitch>
        {routes.map(([path, component]) => <Route path={path} component={component} />)}
        <CacheRoute path="*" component={nomatch} />
      </CacheSwitch>
    </Suspense>
  );
}

export default AutoRouter;
