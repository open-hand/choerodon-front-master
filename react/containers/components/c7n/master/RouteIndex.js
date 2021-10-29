import React, { Suspense } from 'react';
import {
  Route,
  Switch,
  withRouter,
  Redirect,
  BrowserRouter,
} from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ModalContainer } from 'choerodon-ui/pro/lib';
import { inject } from 'mobx-react';
import { mount } from '@choerodon/inject';
import PermissionRoute from '@/components/permission-route';
import { asyncRouter } from '@/hoc';

const Unauthorized = asyncRouter(() => import('../routes/unauthorized'));
const WorkBench = asyncRouter(() => import('../routes/workBench/list/view'));
const WorkBenchEdit = asyncRouter(() => import('../routes/workBench/list/edit'));
const ProjectsPro = asyncRouter(() => import('../routes/projectsPro'));
const ProjectOverview = asyncRouter(() => import('../routes/projectOverview'));
const test = asyncRouter(() => import('./test'));
const InnerIndex = ({ match, AutoRouter, AppState }) => (
  <div
    style={{
      background: 'white',
    }}
  >
    <Switch>
      <Route exact path={`${match.url}projects`} component={ProjectsPro} />
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
      <Route path={`${match.url}test`} component={test} />
      <Route path={match.url} component={AutoRouter} />
    </Switch>
    {mount('base-pro:newUserGuideStep', {
      // AppState.
    })}
    <ModalContainer />
  </div>
);

export default withRouter(inject('AppState')(observer(InnerIndex)));
