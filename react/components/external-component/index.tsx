import React, { ReactNode } from 'react';
import { Loading } from '@choerodon/components';
import loadComponent from '@/utils/loadComponent';

const cache = new Map();

interface Props {
  system: SystemProps
  notFound?: ReactNode
  ErrorComponent?: any
  fallback?: ReactNode
  type?: 'component' | 'func'
  [key: string]: any
}

interface SystemProps {
  scope: string
  module: string
}

function getComponent({ scope, module }: SystemProps, ErrorComponent = null) {
  const scopeItem = cache.get(scope) || new Map();
  cache.set(scope, scopeItem);
  const component = scopeItem.get(module);
  if (component) {
    return component;
  }
  const lazyComponent = React.lazy(
    loadComponent(scope, module, (error: Error) => {
      console.error(error);
      return {
        default: () => ErrorComponent,
      };
    }),
  );
  scopeItem.set(module, lazyComponent);
  return lazyComponent;
}

function ExternalComponent(props: Props) {
  const {
    system, notFound, ErrorComponent, fallback = <Loading />, type = 'component',
  } = props;

  if (!system || !system.scope || !system.module) {
    return <h2>Not system specified</h2>;
  }

  // @ts-ignore
  if (!window[system.scope]) {
    return notFound || <span />;
  }

  const Component = getComponent(system, ErrorComponent);

  if (type === 'func') {
    return Component;
  }

  return (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
}

ExternalComponent.defaultProps = {
  fallback: <Loading />,
  notFound: <span />,
  ErrorComponent: <span />,
  type: 'component',
};

export default ExternalComponent;
