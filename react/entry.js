import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Modal } from 'choerodon-ui';
import { Button } from "choerodon-ui/pro";
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
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

Sentry.init({
  dsn: window._env_.SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  release: `choerodon-front@${window._env_.VERSION}`,
  tracesSampleRate: 1.0,
});

render(
  <Sentry.ErrorBoundary
    fallback={({error, componentStack, resetError}) => (
      <React.Fragment>
        <p>出错了！</p>
        <p>{error.toString()}</p>
        <p>{componentStack}</p>
        <Button onClick={() => window.location.reload()}>
          刷新
        </Button>
      </React.Fragment>
    )}
  >
    <App />
  </Sentry.ErrorBoundary>,
  document.getElementById('app'));
