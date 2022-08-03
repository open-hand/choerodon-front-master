import React, { Suspense, createContext } from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { ModalContainer } from 'choerodon-ui/pro';
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

  return (
    <div
      className="c7ncd-routesIndex"
    >
      <Suspense fallback={<Loading type={get('configuration.master-global:loadingType') || 'c7n'} />}>
        <Switch>
          <Route exact path={`${match.url}projects`} component={ProjectsPro} />
          <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
          <PermissionRoute
            exact
            path={`${match.url}workbench`}
            component={WorkBench}
          />
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
      <ModalContainer />
    </div>
  );
};

export default inject('AppState')(RouteIndex);
