import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import {
  HashRouter as Router, Route,
} from 'react-router-dom';
import stores from './containers/stores';
import { MasterLocaleContainer } from './configs/masterLocaleConfigs';
import {
  UIConfigInitContainer,
} from './configs';

// @ts-ignore
const registerOrg = C7NHasModule('@choerodon/base-pro') ? React.lazy(() => import('@choerodon/base-pro/lib/routes/outward/register-organization')) : <div />;
const App = () => (
  <Provider {...stores}>
    <MasterLocaleContainer>
      <UIConfigInitContainer>
        {/* @ts-ignore */}
        <Router>
          {/* @ts-ignore */}
          <Route path="/" component={registerOrg} />
        </Router>
      </UIConfigInitContainer>
    </MasterLocaleContainer>
  </Provider>
);
const rootNode = document.getElementById('app');

// 入口,react 18之后可以替换为createRoot
render(<App />, rootNode);
