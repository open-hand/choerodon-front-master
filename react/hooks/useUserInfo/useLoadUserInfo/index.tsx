import { useCallback } from 'react';
import {
  useQuery, UseQueryResult, UseQueryOptions,
} from 'react-query';
import { usersApi } from '@/apis';
import { USER_INFO_QUERY_KEY } from '../CONSTANTS';

/**
 * 拉取用户信息的hook
 * @param {UseQueryOptions} queryOptions
 * @return {*}  {UseQueryResult}
 */
const useLoadUserInfo = (queryOptions?:Omit<UseQueryOptions, 'queryKey' | 'queryFn'>):UseQueryResult => {
  const handleSuccess = useCallback((data:any) => {
    console.log(data);
  }, []);

  return useQuery(USER_INFO_QUERY_KEY, () => usersApi.getUserInfo(), {
    ...queryOptions,
    retry: 1,
  });
};

export { useLoadUserInfo };
