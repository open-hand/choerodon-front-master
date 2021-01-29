import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import queryString from 'query-string';
import { QueryClient, QueryClientProvider } from 'react-query';
import { observer, Provider } from 'mobx-react';
import { Spin } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import {
  authorizeC7n, getAccessToken, setAccessToken, handleResponseError,
} from '@/utils';
import Container from '@hzero-front-ui/cfg/lib/components/Container';
import Outward from './containers/components/c7n/routes/outward';
import asyncRouter from './containers/components/util/asyncRouter';
import asyncLocaleProvider from './containers/components/util/asyncLocaleProvider';
import AppState from './containers/stores/c7n/AppState';
import HeaderStore from './containers/stores/c7n/HeaderStore';
import noaccess from './containers/components/c7n/tools/error-pages/403';
import stores from './containers/stores';
import Master from './containers/components/c7n/master';
import './containers/components/style';

const queryClient = new QueryClient();
const spinStyle = {
  textAlign: 'center',
  paddingTop: 300,
};
const language = AppState.currentLanguage;
const UILocaleProviderAsync = asyncRouter(
  () => import('choerodon-ui/lib/locale-provider'),
  { locale: () => import(`choerodon-ui/lib/locale-provider/${language}.js`) },
);
const IntlProviderAsync = asyncLocaleProvider(language,
  () => import(`./containers/locale/${language}`));
const HAS_AGILE_PRO = C7NHasModule('@choerodon/agile-pro');

@withRouter
@observer
export default class Index extends React.Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    window.addEventListener('storage', this.handleStorageChange);
    if (!sessionStorage.getItem('historyPath')) {
      sessionStorage.setItem('historyPath', window.location.hash.split('#')[1]);
    }
    if (!this.isInOutward(this.props.location.pathname)) {
      this.auth();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.location.pathname !== this.props.location.pathname) && prevState.loading) {
      if (!this.isInOutward(this.props.location.pathname)) {
        this.auth();
      }
    } else if ((prevProps.location.pathname !== this.props.location.pathname)
      && !this.props.location.pathname?.startsWith('/iam/enterprise')
      && !localStorage.getItem('hasEnterpriseConfirmed') && !HAS_AGILE_PRO) {
      if (!this.isInOutward(this.props.location.pathname)) {
        this.checkEnterprise();
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  handleStorageChange = (e) => {
    // 其他tab页重新登录，刷新当前页面
    if (e.key === 'relogin') {
      window.location.reload();
    }
  }

  checkEnterprise = async () => {
    try {
      const res = await AppState.checkEnterpriseInfo();
      if (res) {
        localStorage.setItem('hasEnterpriseConfirmed', true);
      } else {
        this.props.history.push('/iam/enterprise');
      }
      return res;
    } catch (e) {
      return true;
    }
  };

  checkOrg = async () => {
    const { email } = AppState.getUserInfo;
    try {
      const res = await AppState.loadOrgDate(email);
      if (res && !res.failed) {
        Modal.open({
          key: Modal.key(),
          title: '试用期限',
          children: `您好，您所属组织的试用期限还剩${res}天。`,
          okText: '我知道了',
          okCancel: false,
        });
      }
    } catch (error) {
      handleResponseError(error);
    }
  }

  auth = async () => {
    this.setState({ loading: true });
    const { access_token: accessToken, token_type: tokenType, expires_in: expiresIn } = queryString.parse(window.location.hash);
    if (accessToken) {
      setAccessToken(accessToken, tokenType, expiresIn);
      // 通知其他tab页刷新
      localStorage.setItem('relogin', Math.random().toString());
      window.location.href = window.location.href.replace(/[&?]redirectFlag.*/g, '');
    } else if (!getAccessToken()) {
      authorizeC7n();
      return false;
    }
    if (!HAS_AGILE_PRO && !this.props.location.pathname?.startsWith('/iam/enterprise')) {
      await this.checkEnterprise();
    }
    HeaderStore.axiosGetRoles();
    AppState.loadModules();
    AppState.loadDeployServices();
    await AppState.loadUserInfo();
    if (HAS_AGILE_PRO && !window._env_.BUSINESS) {
      const hasConfirmed = localStorage.getItem('hasConfirmed');
      if (!hasConfirmed) {
        await this.checkOrg();
        localStorage.setItem('hasConfirmed', true);
      }
    }
    this.setState({ loading: false });
  };

  isInOutward = (pathname) => {
    // eslint-disable-next-line no-underscore-dangle
    const injectOutward = window._env_.outward;
    if (injectOutward) {
      const arr = injectOutward.split(',').concat(['/unauthorized']).map((r) => r.replace(/['"']/g, ''));
      return arr.some((v) => pathname.startsWith(v));
    }
    return false;
  }

  render() {
    const { loading } = this.state;
    if (this.isInOutward(this.props.location.pathname)) {
      return (
        <QueryClientProvider client={queryClient}>
          <UILocaleProviderAsync>
            <IntlProviderAsync>
              <Provider {...stores}>
                <Switch>
                  <Route path="/">
                    <Container defaultTheme="">
                      <Outward AutoRouter={this.props.AutoRouter} />
                    </Container>
                  </Route>
                </Switch>
              </Provider>
            </IntlProviderAsync>
          </UILocaleProviderAsync>
        </QueryClientProvider>
      );
    }
    if (loading) {
      return (
        <div style={spinStyle}>
          <Spin />
        </div>
      );
    }
    return (
      <QueryClientProvider client={queryClient}>
        <UILocaleProviderAsync>
          <IntlProviderAsync>
            <Provider {...stores}>
              <Switch>
                <Route
                  path="/"
                >
                  <Container defaultTheme="">
                    <Master AutoRouter={this.props.AutoRouter} />
                  </Container>
                </Route>
              </Switch>
            </Provider>
          </IntlProviderAsync>
        </UILocaleProviderAsync>
      </QueryClientProvider>
    );
  }
}
