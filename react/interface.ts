declare interface Window {
  _env_: {
    /** 不需要 */
    outward: string
  }
}

/**
 * 判断是否存在这个模块，也就是装了这个包
 * @param {string} dependence
 * @return {*}  {boolean}
 */
declare function C7NHasModule(dependence:string):boolean
