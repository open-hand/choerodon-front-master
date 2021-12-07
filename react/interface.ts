declare interface Window {
  _env_: {
    outward: string // 不需要登录鉴权的页面
    SAAS_FEEDBACK:string // 开放平台地址
    EXTERNAL_LINK:string
    HEADER_TITLE_NAME:string
  }
}

/**
 * 判断是否存在这个模块，也就是装了这个包
 * @param {string} dependence
 * @return {*}  {boolean}
 */
declare function C7NHasModule(dependence:string):boolean
