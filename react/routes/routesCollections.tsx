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
  const [allRoutes, setAllRoutes] = useState(routes);

  const {
    pathname
  } = useLocation();

  function loadComponent(scope, module, onError) {
    return async () => {
      // Initializes the share scope. This fills it with known provided modules from this build and all remotes
      await __webpack_init_sharing__('default');
      const container = window[scope]; // or get the container somewhere else
      // Initialize the container, it may provide shared modules
      if (!container) {
        throw new Error('加载了错误的importManifest.js，请检查服务版本');
      }
      try {
        await container.init(__webpack_share_scopes__.default);
        const factory = await window[scope].get(module);
        const Module = factory();
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
    document.head.appendChild(script);
}

  const asyncGetRemoteEntry = async (path, remoteEntry) => new Promise((resolve) => {
    loadScrip(remoteEntry, () => {
      if (window[path]) {
        const lazyComponent = loadComponent(path, './index');
        resolve([`/${path}`, React.lazy(lazyComponent)])
      } else {
        resolve();
      }
    });
  })

  const callbackWhenPathName = async (path) => {
    let arr = allRoutes;
    // if (window._env_.localRouteName) {
    //   debugger;
    //   const localRouteName = window._env_.localRouteName;
    //   arr = routes.filter(i => i[0].includes(localRouteName))
    // }
    const env: any = window._env_;
    const envList = Object.keys(env);
    if (window[path] && allRoutes.find(i => i[0].includes(path))) {
      return;
    } else {
      const remoteEntry = env[`remote_${path}`];
      if (remoteEntry) {
        if (window[path]) {
          const lazyComponent = loadComponent(path, './index');
          arr.push([`/${path}`, React.lazy(lazyComponent)]);
          setAllRoutes([].concat(arr));
        } else {
          const result = await asyncGetRemoteEntry(path, remoteEntry.replace('$MINIO_URL', env['MINIO_URL']));
          if (result) {
            arr.push(result)
            setAllRoutes([].concat(arr));
          }
        }
      }
    }
    // for (let i = 0; i <= envList.length; i += 1) {
    //   if (i === envList.length) {
    //     setAllRoutes(arr);
    //   } else {
    //     const key = envList[i];
    //     if (arr.find(i => i[0] === `/${key}`)) {
    //       continue;
    //     }
    //     debugger;
    //     const result = await asyncGetRemoteEntry(key, env);
    //     if (result) {
    //       arr.push(result)
    //     }
    //   }
    // }
  }

  useEffect(() => {
    const path = pathname.split('/')[1];
    callbackWhenPathName(path)
  }, [pathname])

  return (
    <Suspense fallback={<Skeleton />}>
      <CacheSwitch>
        {allRoutes.map(([path, component]) => <Route path={path} component={component} />)}
        <CacheRoute path="*" component={() => {
          const path = pathname?.split('/')?.[1];
          if (window[`remote_${path}`]) {
            return <Skeleton />;
          } else {
            return <NoMacth />
          }
        }} />
      </CacheSwitch>
    </Suspense>
  );
}

export default AutoRouter;
