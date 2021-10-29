import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Modal } from 'choerodon-ui/pro';

import { asyncRouter } from '@/hoc';
import autoRefresh from './utils/autoRefresh';
import './utils/iframeStorage';

const MASTERS = asyncRouter(
  () => import('./master'),
  {
    AutoRouter: () => import('./routes'),
  },
);

const getConfirmation = (message:string, callback:CallableFunction) => {
  Modal.open({
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
  <Router getUserConfirmation={getConfirmation}>
    <Switch>
      <Route path="/" component={MASTERS} />
    </Switch>
  </Router>
);

autoRefresh();

// 入口
render(<App />, document.getElementById('app'));
