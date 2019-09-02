import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ModalContainer } from 'choerodon-ui/pro/lib';
import feedback from '../tools/feedback';
import asyncRouter from '../util/asyncRouter';

const Projects = asyncRouter(() => import('../routes/projects'));
const Applications = asyncRouter(() => import('../routes/applications'));
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

export default feedback(withRouter(InnerIndex));
