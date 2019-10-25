import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { authorizeC7n as authorize } from '../../../common';
import asyncRouter from '../util/asyncRouter';
// import feedback from '../tools/feedback';

const Projects = asyncRouter(() => import('../routes/projects'));
const Applications = asyncRouter(() => import('../routes/applications'));
const Charts = asyncRouter(() => import('../routes/charts'));
const Unauthorized = asyncRouter(() => import('../routes/unauthorized'));

const InnerIndex = ({ match, AutoRouter }) => (
  <div>
    <Switch>
        <Route exact path={`${match.url}projects`} component={Projects} />
        <Route exact path={`${match.url}applications`} component={Applications} />
        <Route exact path={`${match.url}charts`} component={Charts} />
        <Route exact path={`${match.url}unauthorized`} component={Unauthorized} />
        <Route path={match.url} component={AutoRouter} />
      </Switch>
  </div>
  
);

export default withRouter(InnerIndex);
