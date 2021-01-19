import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Modal } from 'choerodon-ui';

import asyncRouter from './containers/components/util/asyncRouter';

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
    content: message.split('__@.@__')[1],
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
if (module.hot) {
  module.hot.accept();
}

render(
    <App />,
  document.getElementById('app'));
