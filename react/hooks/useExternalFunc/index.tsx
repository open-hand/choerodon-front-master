import { useCallback, useEffect, useState } from 'react';
import { noop } from 'lodash';
import loadComponent from '@/utils/loadComponent';
import useManifest from '@/hooks/use-manifest';

const cache = new Map();

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

const useExternalFunc = (scope: string, module: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [func, setFunc] = useState();

  const { ready, failed } = useManifest(scope);

  const loadFunc = useCallback(async () => {
    setLoading(true);
    try {
      const funcComponent = await getFunc(scope, module);
      const newFunc = await funcComponent();
      setFunc(newFunc);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready && !failed) {
      loadFunc();
    }
  }, [ready]);

  if (failed) {
    return { func: undefined, loading: false };
  }

  return { func, loading };
};

export default useExternalFunc;
