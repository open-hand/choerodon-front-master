import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { asyncRouter } from '@/hoc';
import './style';
import AppState from '../../../../stores/c7n/AppState';

const Unauthorized = asyncRouter(() => import('../unauthorized'));
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
    const { AutoRouter, history, match } = this.props;
    if (this.isInOutward(this.props.location.pathname)) {
      return (
        <div className="page-wrapper">
          <Switch>
            <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
            <Route path={match.url} component={AutoRouter} />
          </Switch>
        </div>
      );
    }
    history.push('/unauthorized');
    return null;
  }
}

export default Outward;
