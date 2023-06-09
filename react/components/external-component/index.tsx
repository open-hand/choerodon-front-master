import React, { ReactNode } from 'react';
import { Loading } from '@zknow/components';
import loadComponent from '@/utils/loadComponent';
import useManifest from '@/hooks/use-manifest';

const cache = new Map();

interface Props {
  /**
   * 微服务与组件信息
   */
  system: SystemProps
  notFound?: ReactNode
  ErrorComponent?: any
  fallback?: ReactNode
  /**
   * 组件或方法，目前只支持component
   */
  type?: 'component' | 'func'
  /**
   * 组件本身需要的props
   */
  [key: string]: any
}

interface SystemProps {
  /**
   * 微服务的routeName
   */
  scope: string
  /**
   * 组件名
   */
  module: string,
  noFallback?: boolean
}

function getComponent({ scope, module }: SystemProps, ErrorComponent = null) {
  const scopeItem = cache.get(scope) || new Map();
  cache.set(scope, scopeItem);
  const component = scopeItem.get(module);
  if (component) {
    return component;
  }
  const lazyComponent = React.lazy(
    loadComponent(scope, module, (error: Error) => ({
      default: () => ErrorComponent,
    })),
  );
  scopeItem.set(module, lazyComponent);
  return lazyComponent;
}

function ExternalComponent(props: Props) {
  const {
    system, notFound, ErrorComponent, fallback = <Loading />,
  } = props;

  const { ready, failed, preLoad } = useManifest(system?.scope);

  if (!system || !system.scope || !system.module) {
    return <h2>Not system specified</h2>;
  }

  if (failed) {
    return notFound ?? <></>;
  }

  if (!ready && !preLoad) {
    return fallback || <Loading />;
  }

  const Component = getComponent(system, ErrorComponent);

  return (
    <React.Suspense fallback={system?.noFallback ? null : fallback}>
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