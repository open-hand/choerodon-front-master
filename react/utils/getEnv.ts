/* eslint-disable no-underscore-dangle */

export default function getEnv(valueName: string, defaultValue: any) {
  // @ts-ignore
  if (typeof window !== 'undefined' && window._env_ && window._env_[valueName]) {
    // @ts-ignore
    return window._env_[valueName];
  }
  if (defaultValue) {
    return defaultValue;
  }
  return undefined;
}
