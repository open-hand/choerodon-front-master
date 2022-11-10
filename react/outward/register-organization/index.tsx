import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@/index';
import { StoreProvider } from './stores';
import Content from './Content';

// const index = asyncRouter(() => import('./Content'));
const agreement = asyncRouter(() => import('./components/notice/Agreement'));
const serviceAgreement = asyncRouter(() => import('./components/notice/ServiceAgreement'));
export interface Iprops {

}

const index:React.FC<Iprops> = (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

const RegisterIndex = ({ match }:any) => (
  <Switch>
    <Route exact path="/" component={index} />
    <Route exact path="/agreement" component={agreement} />
    <Route exact path="/serviceAgreement" component={serviceAgreement} />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default RegisterIndex;
