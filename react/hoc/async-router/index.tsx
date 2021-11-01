import React, { Component } from 'react';
import esModule from '../utils/esModule';

function transformInjects(inject:any[], getInjects?:getImportsProps | Record<string, any>) {
  if (!getInjects) {
    return {};
  }
  if (typeof getInjects === 'function' && inject[0].getStoreName) {
    return { [inject[0].getStoreName()]: inject[0] };
  }
  if (typeof getInjects === 'object') {
    const result:any = {};
    Object.keys(getInjects).forEach((key, i) => {
      result[key] = inject[i];
    });
    return result;
  }
  return {};
}
function getInjectDataFetchers(getInjects?:getImportsProps | Record<string, any>):any[] {
  if ((getInjects ?? '') !== '') {
    if (typeof getInjects === 'function') {
      return [getInjects()];
    }
    if (typeof getInjects === 'object') {
      return Object.keys(getInjects).map((key) => getInjects[key]?.());
    }
  }
  return [];
}

type getImportsProps = (...args:any[])=>Promise<any>

function asyncRouter(
  getComponent:getImportsProps,
  getInjects?: getImportsProps | Record<string, any>,
  extProps?:any,
  callback?:CallableFunction,
):React.ComponentType {
  return class AsyncRoute extends Component<any, any> {
    constructor(props:any) {
      super(props);
      this.state = {
        Cmp: null,
        injects: {},
      };
    }

    loadData = async () => {
      const injectDataFetchers = getInjectDataFetchers(getInjects);
      const [componentData, ...injectData] = await Promise.all([
        getComponent ? getComponent() : null,
        ...injectDataFetchers,
      ]);
      this.setState({
        Cmp: esModule(componentData),
        injects: transformInjects(esModule(injectData), getInjects),
      }, callback?.());
    }

    componentDidMount() {
      this.loadData();
    }

    render() {
      const { Cmp, injects } = this.state;
      return Cmp && <Cmp {...{ ...extProps, ...this.props, ...injects }} />;
    }
  };
}

export default asyncRouter;
