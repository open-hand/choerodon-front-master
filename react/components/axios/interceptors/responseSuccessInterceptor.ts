import { AxiosResponse } from 'axios';
import get from 'lodash/get';
import {
  prompt,
} from '@/utils';
import { AXIOS_TYPE_DEFAULT } from '../CONSTANTS';

export default function handleResponseInterceptor(response:AxiosResponse) {
  const resData = get(response, 'data');
  const config = get(response, 'config') || {};
  const shouldShowAllResponseData = get(config, 'showAllRepsonseConfigData');

  if (get(response, 'status') === 204) {
    return response;
  }

  const finalResult = shouldShowAllResponseData ? response : resData;

  if (resData?.failed) {
    if (config.application === AXIOS_TYPE_DEFAULT && !config?.noPrompt) {
      prompt(resData?.message, 'error');
    }

    throw finalResult;
  }

  return finalResult;
}
