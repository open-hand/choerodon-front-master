/* eslint-disable */
// @ts-nocheck
import React, { useEffect } from 'react';

const env: any = window._env_;

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

const useDynamicScript = () => {
  useEffect(() => {
    Object.keys(env).forEach((i) => {
      if (i.startsWith('remote_')) {
        const path: any = i.split('_')[1];
        const remoteUrl = env[i];
        loadScrip(remoteUrl.replace('$STATIC_URL', `${env['STATIC_URL']}/${path}`), () => {
          if (window[path]) {
            try {
              const compo = loadComponent(path, `./${path}`);
              const inject = loadComponent(path, './install');
              compo();
              inject();
            } catch (e) {
              console.log(e);
            }
          }
        });
      }
    });
  }, []);
};

export default useDynamicScript;
