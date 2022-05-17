import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import {
  HashRouter as Router,
} from 'react-router-dom';
import { Modal } from 'choerodon-ui/pro';
import PageEntry from './pages';
import './utils/iframeStorage';
import autoRefresh from './utils/autoRefresh';

const getConfirmation = (message:string, callback:CallableFunction) => {
  const restFunction = (m: any) => {
    m?.close();
  };
  const modal = Modal.open({
    className: 'c7n-iam-confirm-modal',
    title: message.split('__@.@__')[0],
    children: message.split('__@.@__')[1],
    key: Modal.key(),
    onOk() {
      callback(true);
      setTimeout(() => {
        restFunction(modal);
      }, 500);
    },
    onCancel() {
      callback(false);
    },
  });
};

autoRefresh();

const App = () => (
  <Router getUserConfirmation={getConfirmation}>
    {/* <ErrorBoundar renderError={(props) => <ErrorPage {...props} />}> */}
    <PageEntry />
    {/* </ErrorBoundar> */}
    {/* <C7NDevTool /> */}
  </Router>
);

const rootNode = document.getElementById('app');

// 入口,react 18之后可以替换为createRoot
render(<App />, rootNode);
