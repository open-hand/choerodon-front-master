import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ModalContainer } from 'choerodon-ui/pro/lib';
import asyncRouter from '../util/asyncRouter';
import feedback from '../tools/feedback';

const Projects = asyncRouter(() => import('../routes/projects'));
const Applications = asyncRouter(() => import('../routes/applications'));
const Charts = asyncRouter(() => import('../routes/charts'));

const InnerIndex = ({ match, AutoRouter }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}projects`} component={Projects} />
      <Route exact path={`${match.url}applications`} component={Applications} />
      <Route exact path={`${match.url}charts`} component={Charts} />
      <Route path={match.url} component={AutoRouter} />
    </Switch>
    <ModalContainer />
  </div>
);

export default feedback(withRouter(InnerIndex));
