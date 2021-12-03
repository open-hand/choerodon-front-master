import { isArray } from 'lodash';

const moduleDefaultExport = (module:any) => module.default || module;

export default function esModule(module: any) {
  if (isArray(module)) {
    return module.map(moduleDefaultExport);
  }
  return moduleDefaultExport(module);
}
