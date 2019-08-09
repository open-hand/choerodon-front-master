import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import asyncRouter from '@choerodon/boot/lib/containers/components/util/asyncRouter';
import { ModalContainer } from 'choerodon-ui/pro/lib';

const Projects = asyncRouter(() => import('../routes/projects/index'));

const InnerIndex = ({ match, AutoRouter }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}projects`} component={Projects} />
      <Route path={match.url} component={AutoRouter} />
    </Switch>
    <ModalContainer />
  </div>
);

export default withRouter(InnerIndex);
