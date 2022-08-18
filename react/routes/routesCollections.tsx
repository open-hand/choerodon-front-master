/* eslint-disable */
// @ts-nocheck
import React, { Suspense, useEffect, useState } from 'react';
import { Route, useLocation  } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import NoMacth from '@/components/c7n-error-pages/404';
import Skeleton from '@/components/skeleton';

// @ts-expect-error
const routes:[string, React.ComponentType][] = __ROUTES__ || [];

const AutoRouter = () => {
  console.log(useLocation());
  const [allRoutes, setAllRoutes] = useState(routes);

  const {
    pathname
  } = useLocation();

  function loadComponent(scope, module, onError) {
    return async () => {
      // Initializes the share scope. This fills it with known provided modules from this build and all remotes
      await __webpack_init_sharing__('default');
      debugger;
      const container = window[scope]; // or get the container somewhere else
      debugger;
      // Initialize the container, it may provide shared modules
      if (!container) {
        throw new Error('加载了错误的importManifest.js，请检查服务版本');
      }
      try {
        await container.init(__webpack_share_scopes__.default);
        debugger;
        const factory = await window[scope].get(module);
        const Module = factory();
        debugger;
        return Module;
      } catch (e) {
        if (onError) {
          return onError(e);
        }
        throw e;
      }
    };
  }

  const loadScrip = (url, callback) => {
    let script = document.createElement('script');
    if (script.readyState) { // IE
        script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else { // 其他浏览器
        script.onload = function () {
            callback();
        }
    }
    script.src = url;
    script.crossOrigin  = 'anonymous';
    document.body.appendChild(script);
}

  const asyncGetRemoteEntry = async (key: string, env: any) => new Promise((resolve) => {
    if (key.startsWith('remote-')) {
      debugger;
      const routeName = key.split('-')[1];
      const routeRemote = env[key];
      if (window[routeName]) {
        resolve();
      } else {
        loadScrip(routeRemote, () => {
          console.log(window[routeName])
          if (window[routeName]) {
            const lazyComponent = loadComponent(routeName, './index');
            resolve([`/${routeName}`, React.lazy(lazyComponent)])
          } else {
            resolve();
          }
        });
      }
    } else {
      debugger;
      resolve();
    }
  })

  const callbackWhenPathName = async () => {
    let arr = [];
    if (window._env_.localRouteName) {
      debugger;
      const localRouteName = window._env_.localRouteName;
      arr = routes.filter(i => i[0].includes(localRouteName))
    }
    const env: any = window._env_;
    const envList = Object.keys(env);
    debugger;
    for (let i = 0; i <= envList.length; i += 1) {
      if (i === envList.length) {
        setAllRoutes(arr);
      } else {
        const key = envList[i];
        debugger;
        const result = await asyncGetRemoteEntry(key, env);
        if (result) {
          arr.push(result)
        }
      }
    }
  }

  useEffect(() => {
    callbackWhenPathName()
  }, [pathname])

  console.log(allRoutes);

  return (
    <Suspense fallback={<Skeleton />}>
      <CacheSwitch>
        {allRoutes.map(([path, component]) => <Route path={path} component={component} />)}
        <CacheRoute path="*" component={NoMacth} />
      </CacheSwitch>
    </Suspense>
  );
}

export default AutoRouter;
