import { AxiosError } from 'axios';

export default function handleRequestError(err:AxiosError) {
  const error = err;
  return Promise.reject(error);
}
