const InjectedFunction = {
  openTemplate: () => {},
};
export function inject(key, func) {
  InjectedFunction[key] = func;
}
export { InjectedFunction };
