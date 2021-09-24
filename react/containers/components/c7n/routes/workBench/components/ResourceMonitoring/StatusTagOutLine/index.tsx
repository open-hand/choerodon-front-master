import React, { useMemo } from 'react';
import { Tooltip } from 'choerodon-ui/pro';

import { StatusTagOutLineProps, statusKindsMap } from './interface';

import './index.less';

const prefixCls = 'c7ncd-resource-monitoring';

const statusKindMap:statusKindsMap = {
  success: {
    text: '成功',
    bgColor: 'rgba(31, 194, 187, 0.12)',
    fontColor: 'rgba(31, 194, 187, 1)',
    hoverText: '测试连接：成功',
  },
  failed: {
    text: '失败',
    bgColor: 'rgba(247, 103, 118, 0.12)',
    fontColor: 'rgba(247, 103, 118, 1)',
    hoverText: '测试连接：失败',
  },
  operating: {
    text: '连接中',
    bgColor: 'rgba(77, 144, 254, 0.12)',
    fontColor: 'rgba(77, 144, 254, 1)',
    hoverText: '测试连接中',
  },
  processing: {
    text: '处理中',
    bgColor: 'rgba(77, 144, 254, 0.12)',
    fontColor: 'rgba(77, 144, 254, 1)',
    hoverText: '',
  },
  occupied: {
    text: '占用中',
    bgColor: 'rgba(158, 173, 190, 0.16)',
    fontColor: 'rgba(15, 19, 88, 0.36)',
    hoverText: '连接被占用',
  },
  default: {
    text: 'unknown',
    bgColor: 'rgba(216, 216, 216, 0.12)',
    fontColor: 'rgb(216, 216, 216)',
    hoverText: '',
  },
  connected: {
    text: '已连接',
    bgColor: '#e6fffb',
    fontColor: '#1fc2bb',
    hoverText: '',
  },
  disconnect: {
    text: '未连接',
    bgColor: '#fffbe6',
    fontColor: '#faad14',
    hoverText: '',
  },
};

const StatusTag: React.FC<StatusTagOutLineProps> = ({
  status,
  type,
}) => {
  const tag = useMemo(() => (
    <span
      className={`${prefixCls}-statusTagOutLine`}
      style={{
        color: statusKindMap[status]?.fontColor,
        backgroundColor: statusKindMap[status]?.bgColor,
        borderColor: statusKindMap[status]?.fontColor,
      }}
    >
      {statusKindMap[status]?.text}
    </span>
  ), [status]);

  if (type === 'cluster') {
    return tag;
  }

  return (
    <Tooltip title={statusKindMap[status]?.hoverText}>{tag}</Tooltip>
  );
};

StatusTag.defaultProps = {
  status: 'default',
  type: 'host',
};

export default StatusTag;
