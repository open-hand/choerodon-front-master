import { removeAccessToken } from '@/utils/accessToken';
import { authorizeUrl } from '@/utils/authorize';
import {
  prompt,
} from '@/utils';
import { AxiosError } from 'axios';

const regTokenExpired = /(PERMISSION_ACCESS_TOKEN_NULL|error.permission.accessTokenExpired)/;

export default function handelResponseError(error: AxiosError) {
  const { response } = error;
  if (response) {
    const { status } = response;
    switch (status) {
      case 401: {
        removeAccessToken();
        authorizeUrl();
        break;
      }
      case 403: {
        if (regTokenExpired.test(response.data)) {
          removeAccessToken();
          authorizeUrl();
        }
        break;
      }
      default:
        prompt(response.data, 'error');
        break;
    }
  }
  throw error;
}
