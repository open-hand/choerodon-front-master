import { useQueryClient } from 'react-query';
import { UserInfoProps } from '@/typings';
import { USER_INFO_QUERY_KEY } from '../CONSTANTS';

/**
 * 获取用户信息的hook
 * @return {*}
 */
const useGetUserInfo = () => {
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(USER_INFO_QUERY_KEY) as UserInfoProps;
  return userInfo;
};

export { useGetUserInfo };
