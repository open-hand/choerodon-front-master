// 这里用来配置需要隐藏头部的路由

import { ENTERPRISE_ADDRESS } from './PATHS';

const HIDDEN_HEAD_PATHS_COLLECTION = [
  ENTERPRISE_ADDRESS,
] as const;

export {
  HIDDEN_HEAD_PATHS_COLLECTION,
};
