function loadComponent(scope, module, onError) {
  console.log('loadComponent1');

  return async () => {
    console.log('loadComponent2');
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    console.log('container===', container);
    if (!container) {
      throw new Error('加载了错误的importManifest.js，请检查服务版本');
    }
    try {
      await container.init(__webpack_share_scopes__.default);
      const factory = await window[scope].get(module);
      const Module = factory();
      console.log('factory===', factory);
      console.log('Module===', Module);
      return Module;
    } catch (e) {
      console.log('error');
      if (onError) {
        return onError(e);
      }
      throw e;
    }
  };
}

export default loadComponent;
