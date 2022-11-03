import React from 'react';
import { noop } from 'lodash';
import loadComponent from '@/utils/loadComponent';

const cache = new Map();

interface Props {
  scope: string
  funcName: string
}

async function getFunc(scope: string, module: string) {
  const scopeItem = cache.get(scope) || new Map();
  cache.set(scope, scopeItem);
  const component = scopeItem.get(module);
  if (component) {
    return component;
  }
  const lazyComponent = await loadComponent(scope, module, (error: Error) => ({
    default: noop,
  }));
  scopeItem.set(module, lazyComponent);
  return lazyComponent;
}

export default async function getExternalFunc(props: Props) {
  const {
    scope, funcName,
  } = props || {};

  // @ts-ignore
  if (!scope || !funcName || !window[scope]) {
    return noop;
  }

  const func = await getFunc(scope, funcName);

  return func();
}
