import AxiosCache from './cacheAxios';
import AxiosEmmitter from './axiosEventEmmiter';
import RouteAxios from './routeAxios';

export const axiosEvent = new AxiosEmmitter();
export const axiosCache = new AxiosCache();
export const axiosRoutesCancel = new RouteAxios();
