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

  const { ready, failed, preLoad } = useManifest(scope);

  const loadFunc = useCallback(async () => {
    if (scope === 'haitianMaster') {
      console.log('loadFunc1');
    }
    setLoading(true);
    try {
      const funcComponent = await getFunc(scope, module);
      const newFunc = await funcComponent();
      setFunc(newFunc);
      if (scope === 'haitianMaster') {
        console.log('loadFunc');
      }
      setLoading(false);
    } catch (e) {
      if (scope === 'haitianMaster') {
        console.log('loadFunc3');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (scope === 'haitianMaster') {
      console.log('useExternalFunc useEffect');
      console.log('ready======', ready);
      console.log('preLoad======', preLoad);
      console.log('failed======', failed);
    }
    if ((ready || preLoad) && !failed) {
      console.log('loadFunc');
      loadFunc();
    }
  }, [ready, preLoad]);

  if (failed) {
    if (scope === 'haitianMaster') {
      console.log('loading1======', loading);
    }
    return { func: undefined, loading: false };
  }

  if (scope === 'haitianMaster') {
    console.log('loading2======', loading);
  }

  return { func, loading };
};

export default useExternalFunc;
