import { AxiosRequestConfig } from 'axios';

export interface customAxiosRequestConfig extends AxiosRequestConfig {
  isCustomTransformResponseHandled?: boolean
}
