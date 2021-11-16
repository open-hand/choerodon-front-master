import React, { Suspense } from 'react';
import {
  Route,
  Switch,
  withRouter,
  Redirect,
} from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { ModalContainer } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { mount } from '@choerodon/inject';
import { Loading } from '@choerodon/components';
import PermissionRoute from '@/components/permission-route';

const Unauthorized = React.lazy(() => import('../routes/unauthorized'));
const WorkBench = React.lazy(() => import('../routes/workBench/list/view'));
const WorkBenchEdit = React.lazy(() => import('../routes/workBench/list/edit'));
const ProjectsPro = React.lazy(() => import('../routes/projectsPro'));
const ProjectOverview = React.lazy(() => import('../routes/projectOverview'));
const Tests = React.lazy(() => import('../routes/testapp'));
const AutoRouter = React.lazy(() => import('@/routes'));

const InnerIndex = ({ match, AppState }) => (
  <div
    style={{
      background: 'white',
      height: '100%',
    }}
  >
    <Suspense fallback={<Loading type="c7n" />}>
      <Switch>
        <Route exact path={`${match.url}projects`} component={ProjectsPro} />
        <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
        <Route exact path={`${match.url}testst`} component={Tests} />
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
        <Route path={match.url} component={AutoRouter} />
      </Switch>
    </Suspense>
    {mount('base-pro:newUserGuideStep')}
    <ModalContainer />
  </div>
);

export default withRouter(inject('AppState')(observer(InnerIndex)));
