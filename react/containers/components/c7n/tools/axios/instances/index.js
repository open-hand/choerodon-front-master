import AxiosCache from './cacheAxios';
import AxiosEmmitter from './axiosEventEmmiter';

export const axiosEvent = new AxiosEmmitter();
export const axiosCache = new AxiosCache();
