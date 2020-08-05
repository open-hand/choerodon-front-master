import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import nomatch from './containers/components/c7n/tools/error-pages/404';

const AutoRouter = () => (
  <Suspense fallback={<span />}>
    <CacheSwitch>
      {/* eslint-disable-next-line no-undef */}
      {__ROUTES__}
      <CacheRoute path="*" component={nomatch} />
    </CacheSwitch>
  </Suspense>
);

export default AutoRouter;
