import React, { Component, Suspense } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import './style';
import { Loading } from '@choerodon/components';
import AppState from '../../../../stores/c7n/AppState';

const Unauthorized = React.lazy(() => import('../unauthorized'));
const AutoRouter = React.lazy(() => import('@/routes/routesCollections'));

@withRouter
@inject('AppState')
@observer
class Outward extends Component {
  componentDidMount() {
    if (!AppState.siteInfo.systemTitle) {
      this.initFavicon();
    }
    AppState.changeMenuType({
      type: 'site',
    });
  }

  isInOutward = (pathname) => {
    // eslint-disable-next-line no-underscore-dangle
    const injectOutward = window._env_.outward;
    if (injectOutward) {
      const arr = injectOutward.split(',').concat(['/unauthorized']).map((r) => r.replace(/['"']/g, ''));
      return arr.some((v) => pathname.startsWith(v));
    }
    return false;
  }

  initFavicon() {
    AppState.loadSiteInfo().then((data) => {
      const link = document.createElement('link');
      const linkDom = document.getElementsByTagName('link');
      if (linkDom) {
        for (let i = 0; i < linkDom.length; i += 1) {
          if (linkDom[i].getAttribute('rel') === 'shortcut icon') document.head.removeChild(linkDom[i]);
        }
      }
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = data.favicon || 'favicon.ico';
      document.head.appendChild(link);
      if (data.systemTitle) {
        document.getElementsByTagName('title')[0].innerText = data.systemTitle;
      }
      AppState.setSiteInfo(data);
    });
  }

  render() {
    const { history, match } = this.props;
    if (this.isInOutward(this.props.location.pathname)) {
      return (
        <div className="page-wrapper">
          <Suspense fallback={<Loading type="c7n" />}>
            <Switch>
              <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
              <Route path={match.url} component={AutoRouter} />
            </Switch>
          </Suspense>
        </div>
      );
    }
    history.push('/unauthorized');
    return null;
  }
}

export default Outward;
