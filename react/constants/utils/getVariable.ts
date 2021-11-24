/* eslint-disable no-underscore-dangle */
function getVariable(valueName:string, defaultValue?:string) {
  // @ts-ignore
  if (window._env_ && window._env_[valueName]) {
    // @ts-ignore
    return window._env_[valueName];
  }
  if (defaultValue) {
    return defaultValue;
  }
  return undefined;
}

export default getVariable;
