import React from 'react';
import { withRouter, HashRouter as Router, Route, Switch } from 'react-router-dom';
import queryString from 'query-string';
import { inject, observer, Provider } from 'mobx-react';
import { OUTWARD } from '@choerodon/boot/lib/containers/common/constants';
import Outward from './containers/components/c7n/routes/outward';
// import Master from './containers/components/c7n/master/Master';
import asyncRouter from './containers/components/util/asyncRouter';
import asyncLocaleProvider from './containers/components/util/asyncLocaleProvider';
import { authorizeC7n, getAccessToken, setAccessToken, dashboard, WEBSOCKET_SERVER } from './containers/common';
import AppState from './containers/stores/c7n/AppState';
import noaccess from './containers/components/c7n/tools/error-pages/403';
import stores from './containers/stores';
import './containers/components/style';

const outwardPath = ['#/organization/register-organization', '#/organization/register-organization/agreement'];

@observer
export default class Index extends React.Component {
  auth = async () => {
    const { access_token: accessToken, token_type: tokenType, expires_in: expiresIn } = queryString.parse(window.location.hash);
    if (accessToken) {
      setAccessToken(accessToken, tokenType, expiresIn);
      window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
    } else if (!getAccessToken()) {
      authorizeC7n();
      return false;
    }
    AppState.setUserInfo(await AppState.loadUserInfo());
    return true;
  }

  render() {
    const UILocaleProviderAsync = asyncRouter(
      () => import('choerodon-ui/lib/locale-provider'),
      { locale: () => import(`choerodon-ui/lib/locale-provider/${AppState.currentLanguage}.js`) },
    );

    const language = AppState.currentLanguage;
    const IntlProviderAsync = asyncLocaleProvider(language, 
      () => import(`./containers/locale/${language}`),
      () => import(`react-intl/locale-data/${language.split('_')[0]}`));
    const Master = asyncRouter(
      () => import('./containers/components/c7n/master'),
      null,
      { ...this.props },
    );
    const OUTWARD_ARR = OUTWARD === 'undefined' || !OUTWARD ? [] : OUTWARD.split(',');
    const customInner = OUTWARD_ARR.some(v => window.location.hash.startsWith(v));
    if (outwardPath.includes(window.location.hash) || customInner) {
      return (
        <UILocaleProviderAsync>
          <IntlProviderAsync>
            <Provider {...stores}>
              <Switch>
                <Route path="/" component={Outward} />
              </Switch>
            </Provider>
          </IntlProviderAsync>
        </UILocaleProviderAsync>
      );
    } else {
      return (
        <UILocaleProviderAsync>
          <IntlProviderAsync>
            <Provider {...stores}>
              <Switch>
                <Route
                  path="/"
                  component={this.auth() ? Master : noaccess}
                />
              </Switch>
            </Provider>
          </IntlProviderAsync>
        </UILocaleProviderAsync>
      );
    }
  }
}
