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
import RegisterOrg from './outward/register-organization';

// __REGISTERORG__;

const App = () => (
  <Provider {...stores}>
    <MasterLocaleContainer>
      <UIConfigInitContainer>
        <Router>
          {/* @ts-ignore */}
          <Route component={RegisterOrg} />
        </Router>
      </UIConfigInitContainer>
    </MasterLocaleContainer>
  </Provider>
);

export default App;
