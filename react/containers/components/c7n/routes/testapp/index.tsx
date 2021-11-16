import React from 'react';
import { Route, Switch } from 'react-router';
import Bread from '@/components/c7n-breadCrumb';

const TestApp = ({
  match,
}:any) => (
  <div>
    <Bread />
    <Switch>
      <Route exact path={`${match.url}`} component={() => <>e21e12</>} />
      <Route exact path={`${match.url}/current`} component={() => <>e2dsadasdasdsa1e12</>} />
    </Switch>
  </div>
);

export default TestApp;
