import { isArray } from 'lodash';

const moduleDefaultExport = (module: { default: any; }) => module.default || module;

export default function esModule(module: any[]) {
  if (isArray(module)) {
    return module.map(moduleDefaultExport);
  }
  return moduleDefaultExport(module);
}
