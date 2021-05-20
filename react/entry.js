import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Modal } from 'choerodon-ui/pro';

import asyncRouter from './containers/components/util/asyncRouter';
import autoRefresh from './utils/autoRefresh';

const history = createBrowserHistory();
const { confirm } = Modal;
const MASTERS = asyncRouter(
  () => import('./master'),
  {
    AutoRouter: () => import('./routes'),
  },
);

const getConfirmation = (message, callback) => {
  confirm({
    className: 'c7n-iam-confirm-modal',
    title: message.split('__@.@__')[0],
    children: message.split('__@.@__')[1],
    onOk() {
      callback(true);
    },
    onCancel() {
      callback(false);
    },
  });
};

const App = () => (
  <Router history={history} getUserConfirmation={getConfirmation}>
    <Switch>
      <Route path="/" component={MASTERS} />
    </Switch>
  </Router>
);

autoRefresh();
render(
  <App />,
  document.getElementById('app'),
);
