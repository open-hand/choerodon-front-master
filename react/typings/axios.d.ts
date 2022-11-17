export type {
  AxiosStatic, AxiosAdapter, AxiosBasicCredentials, AxiosError, AxiosInterceptorManager, AxiosProxyConfig,
  AxiosTransformer, AxiosRequestConfig,
} from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        noPrompt?: boolean
        useCache?: boolean
        enabledCancelRoute?: boolean,
        cancelCacheKey?: string,
        showAllRepsonseConfigData?: boolean
        application?: 'default' | 'ui',
    }
    export type AxiosC7nPromise<T extends any = any> = Promise<AxiosResponse<T>>
    export type AxiosC7nResponse<T extends any = any> = T;
    export interface AxiosInstance {
        <T extends any = any>(config: AxiosRequestConfig): AxiosC7nPromise<T>;
        all: AxiosStatic['all'];
        spread: AxiosStatic['spread'];
        defaults: AxiosRequestConfig;
        interceptors: {
            request: AxiosInterceptorManager<AxiosRequestConfig>;
            response: AxiosInterceptorManager<AxiosC7nResponse>;
        };
        request<T extends any = any>(config: AxiosRequestConfig): AxiosC7nPromise<T>;
        get<T extends any = any> (url: string, config?: AxiosRequestConfig): AxiosC7nPromise<T>;
        delete<T extends any = any> (url: string, config?: AxiosRequestConfig): AxiosC7nPromise<T>;
        head(url: string, config?: AxiosRequestConfig): AxiosC7nPromise;
        post<T extends any = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosC7nPromise<T>;
        put<T extends any = any> (url: string, data?: any, config?: AxiosRequestConfig): AxiosC7nPromise<T>;
        patch<T extends any = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosC7nPromise<T>;
    }
}
