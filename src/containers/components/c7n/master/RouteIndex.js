import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import asyncRouter from '@choerodon/boot/lib/containers/components/util/asyncRouter';
import { ModalContainer } from 'choerodon-ui/pro/lib';

const Projects = asyncRouter(() => import('../routes/projects/index'));
const Applications = asyncRouter(() => import('../routes/applications/index'));
const ApplicationsDetail = asyncRouter(() => import('../routes/applications-detail'));

const InnerIndex = ({ match, AutoRouter }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}projects`} component={Projects} />
      <Route exact path={`${match.url}applications/:projectId/:id`} component={ApplicationsDetail} />
      <Route exact path={`${match.url}applications`} component={Applications} />
      <Route path={match.url} component={AutoRouter} />
    </Switch>
    <ModalContainer />
  </div>
);

export default withRouter(InnerIndex);
