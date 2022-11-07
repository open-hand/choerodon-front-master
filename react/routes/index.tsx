import React, { Suspense, createContext, useEffect } from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { ModalProvider } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { mount, get } from '@choerodon/inject';
import { Loading } from '@choerodon/components';
import PermissionRoute from '@/components/permission-route';
import './index.less';

const Unauthorized = React.lazy(() => import('@/containers/components/c7n/routes/unauthorized'));
const WorkBench = React.lazy(() => import('@/containers/components/c7n/routes/workBench/list/view'));
const WorkBenchEdit = React.lazy(() => import('@/containers/components/c7n/routes/workBench/list/edit'));
const ProjectsPro = React.lazy(() => import('@/containers/components/c7n/routes/projectsPro'));
const ProjectOverview = React.lazy(() => import('@/containers/components/c7n/routes/projectOverview'));

// this is child services routes collections page
const AutoRouter = React.lazy(() => import('./routesCollections'));

const RouteIndex = () => {
  const match = useRouteMatch();

  const redirectWorkBench = get('configuration.master-global:redirectWorkBench');

  const workBenchRoute = () => {
    if (redirectWorkBench) {
      return (
        <Route
          exact
          path={`${match.url}workbench`}
          // @ts-ignore
          component={() => {
            window.location.href = `${window.location.origin}/#${redirectWorkBench}`;
            return null;
          }}
        />
      );
    }
    return (
      <PermissionRoute
        exact
        path={`${match.url}workbench`}
        component={WorkBench}
      />
    );
  };

  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    window.___choeordonHistory__ = history;
  }, [history]);

  return (
    <div
      className="c7ncd-routesIndex"
    >
      <ModalProvider location={location}>
        <Suspense fallback={<Loading type={get('configuration.master-global:loadingType') || 'c7n'} />}>
          <Switch>
            <Route exact path={`${match.url}projects`} component={ProjectsPro} />
            <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
            {workBenchRoute()}
            <PermissionRoute
              service={['choerodon.code.project.project.overview.ps.default']}
              exact
              path={`${match.url}agile/project-overview`}
              component={ProjectOverview}
            />
            <Route exact path="/">
              <Redirect to={`${match.url}workbench`} />
            </Route>
            <Route path={`${match.url}workbench/edit`} component={WorkBenchEdit} />
            <Route path={match.url} component={AutoRouter} />
          </Switch>
        </Suspense>
        {/* {mount('base-pro:newUserGuideStep', {})} */}
      </ModalProvider>
    </div>
  );
};

export default inject('AppState')(RouteIndex);
