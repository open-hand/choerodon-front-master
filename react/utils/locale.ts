/**
 * 多语言工具类
 */

export type KeysDistributeObject<T extends string> = { [K in T]: string }
interface LocaleExportObject<T extends string, K extends string, SK extends string = 'agile'> {
  /** 当前拆分的文件的前缀 */
  intlPrefix: T
  /** 服务前缀 */
  servicePrefix?: SK
  intlObject: KeysDistributeObject<K>
}
/**
 * 对象key增加统一前缀
 * @todo ts4.1↑ 支持字符串模块，可以输入一个对象后，返回拼接好前缀的字符串对象
 * @param obj
 */

export function localeAppendPrefixObjectKey<T extends string, P extends string, SK extends string>(obj: LocaleExportObject<T, P, SK>) {
  const intlPrefix = `${obj.servicePrefix || 'agile'}.${obj.intlPrefix}`;
  const keys = Object.keys(obj.intlObject) as Array<P>;
  const intlObject = keys
    .reduce((pre, key) => ({
      ...pre,
      [`${intlPrefix}.${key}`]: obj.intlObject[key as keyof typeof obj.intlObject],
    }), {}) as KeysDistributeObject<typeof intlPrefix>;
  return intlObject;
}
/**
 * 异步加载多个多语言模块
 *  @example
 * // PS:master的多语言一般不需要合并导入
 * asyncImportLocales(import(`./locale/${language}/index.js`), import(`@choerodon/master/lib/locale/${language}/index.js`))
 * @param args
 * @returns
 */
export async function asyncImportLocales<T extends { [key: string]: string }>(...args: Promise<any>[]): Promise<Record<string, T>> {
  const localePackages = await Promise.all(args);
  return Object.values(localePackages).reduce((pre, current, currentIndex) => {
    // 避免多模块重复覆盖
    const uniqueCurrentModules = Object.keys(current).reduce((m, key) => ({
      ...m,
      [`${key}${currentIndex}`]: current[key],
    }), {});
    return ({ ...pre, ...uniqueCurrentModules });
  }, {});
}
/**
 * 合并多个导入多语言导入模块
 * @example
 * import Agile from './locale/agile';
 * import Master from './locale/master';
 * import Devops from './locale/devops';
 * const AgileProReferenceLocale = mergeLocaleModule(Agile, Master, Devops);
 * @param args
 * @returns
 */
export function mergeLocaleModule(...args: Array<Record<string, Record<string, string>> | Record<string, string>>): Record<string, string> {
  return args.reduce<Record<string, string>>((p, m) => {
    const currentModuleValues = Object.values(m);
    return ({ ...p, ...(currentModuleValues.some((i) => typeof i === 'string') ? [m] : currentModuleValues).reduce((mp, r) => ({ ...mp, ...r }), {}) });
  }, {});
}
