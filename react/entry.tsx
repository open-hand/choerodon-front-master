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
import { useAutoRefresh } from './hooks';

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

const App = () => {
  useAutoRefresh();
  return (
    <Router getUserConfirmation={getConfirmation}>
      <PageEntry />
    </Router>
  );
};

const rootNode = document.getElementById('app');

// 入口,react 18之后可以替换为createRoot
render(<App />, rootNode);
