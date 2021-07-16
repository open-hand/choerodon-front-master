import { StatusKind } from '@choerodon/components/lib/status-tag/interface';

export const statusKindMap: {
  [K: string]: {
    text: string;
    code: StatusKind;
  }
} = {
  success: {
    text: '成功',
    code: 'success',
  },
  failed: {
    text: '失败',
    code: 'failed',
  },
  operating: {
    text: '连接中',
    code: 'running',
  },
  occupied: {
    text: '占用中',
    code: 'pending',
  },
  default: {
    text: 'unknown',
    code: 'lost',
  },
  connected: {
    text: '已连接',
    code: 'success',
  },
  disconnect: {
    text: '未连接',
    code: 'disconnect',
  },
};

export type statusKindMapKey = keyof typeof statusKindMap;
