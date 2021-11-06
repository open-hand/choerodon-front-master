import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import {
  HashRouter as Router,
} from 'react-router-dom';
import { Modal } from 'choerodon-ui/pro';

import { asyncRouter } from '@/hoc';
import './utils/iframeStorage';

const MASTERS = asyncRouter(
  () => import('./master'),
  {
    // 收集子服务的路由
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
    <MASTERS />
  </Router>
);

const rootNode = document.getElementById('app');

// 入口,react 18之后可以替换为createRoot
render(<App />, rootNode);
