import type { History } from 'history';

declare global {
    interface Window {
        /** 内部的to 跳转方法使用的history */
        ___choeordonHistory__: History | null
        __choeordonStores__: any
        _env_: {
            localRouteName: any
            YQ_FEEDBACK_SDK: string
            outward: string // 不需要登录鉴权的页面
            SAAS_FEEDBACK: string // 开放平台地址
            EXTERNAL_LINK: string
            HEADER_TITLE_NAME: string
        }
    }
    declare function C7NHasModule(dependence: string): boolean

}
export { };
