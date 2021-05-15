import React, { Suspense } from 'react';
import {
  Route, Switch, withRouter, Redirect, BrowserRouter,
} from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ModalContainer } from 'choerodon-ui/pro/lib';
import { inject } from 'mobx-react';
import PermissionRoute from '@/components/permission-route';
import asyncRouter from '../util/asyncRouter';

const Projects = asyncRouter(() => import('../routes/projects'));
const Applications = asyncRouter(() => import('../routes/applications'));
const Charts = asyncRouter(() => import('../routes/charts'));
const Unauthorized = asyncRouter(() => import('../routes/unauthorized'));
const WorkBench = asyncRouter(() => import('../routes/workBench'));
const ProjectsPro = asyncRouter(() => import('../routes/projectsPro'));
const ProjectOverview = asyncRouter(() => import('../routes/projectOverview'));
const Skeleton = asyncRouter(() => import('./skeleton/index.js'));
const InnerIndex = ({ match, AutoRouter, AppState }) => (
  <div
    style={{
    background: 'white',
  }}
  >
    <Switch>
      <Route exact path={`${match.url}projects`} component={ProjectsPro} />
      <Route exact path={`${match.url}applications`} component={Applications} />
      <PermissionRoute
        service={['choerodon.code.project.operation.chart.ps.default']}
        exact
        path={`${match.url}charts`}
        component={Charts}
      />
      <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
      <PermissionRoute
        exact
        path={`${match.url}workbench`}
        component={() => {
          if (AppState.currentMenuType.organizationId) {
            return <WorkBench />;
          }
          return '';
        }}
      />
      <Route exact path={`${match.url}test`} component={Skeleton} />
      <Route exact path={`${match.url}projectsPro`} component={ProjectsPro} />
      <PermissionRoute
        service={['choerodon.code.project.project.overview.ps.default']}
        exact
        path={`${match.url}agile/project-overview`}
        component={ProjectOverview}
      />
      <Route exact path="/">
        <Redirect to={`${match.url}workbench`} />
      </Route>
      <Route path={match.url} component={AutoRouter} />
    </Switch>
    <ModalContainer />
  </div>
);

export default withRouter(inject('AppState')(observer(InnerIndex)));
