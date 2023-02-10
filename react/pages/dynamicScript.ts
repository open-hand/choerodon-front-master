/* eslint-disable */
// @ts-nocheck
import React, { useEffect } from "react";
import { EventEmitter } from "events";

const eventBus = new EventEmitter();

const env: any = window._env_;
window.loadFlag = {};

function loadComponent(scope, module, onError) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    if (!container) {
      throw new Error("加载了错误的importManifest.js，请检查服务版本");
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

const loadScript = (url, callback) => {
  // 已加载的资源不再重新加载
  const scripts = Array.from(document.getElementsByTagName("script"));
  const isExist = scripts.find((script) => script.src === url);
  if (isExist) {
    if (
      window.loadFlag[url] ||
      url?.includes(`localhost:${window.location.port}`) ||
      url?.includes(`127.0.0.1:${window.location.port}`)
    ) {
      setReady(true);
    } else {
      eventBus.once(url, () => {
        setReady(true);
      });
    }
  }

  const element = document.createElement("script");

  element.src = url;
  element.type = "text/javascript";
  // element.async = true;

  window.loadFlag[url] = true;

  element.onload = () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Dynamic Script Loaded: ${url}`);
    }
    eventBus.emit(url);
    callback();
  };

  element.onerror = () => {
    console.error(`Dynamic Script Error: ${url}`);
    // setReady(false);
    // setFailed(true);
  };

  document.head.appendChild(element);
};

const useDynamicScript = () => {
  useEffect(() => {
    const microValue = env["MICRO_SERVICE"];
    if (microValue) {
      microValue.split(",")?.forEach((i) => {
        const url = env[i] || `${env["STATIC_URL"]}/${i}`;
        loadScript(`${url}/importManifest.js`, () => {
          if (window[i]) {
            try {
              const compo = loadComponent(i, `./${i}`);
              const inject = loadComponent(i, "./install");
              // compo();
              inject();
            } catch (e) {
              console.log(e);
            }
          }
        });
      });
    }
  }, []);
};

export default useDynamicScript;
