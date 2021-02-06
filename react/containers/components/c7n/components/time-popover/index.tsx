/**
 * hover 显示时间
 */
import React, { memo } from 'react';
import { Tooltip } from 'choerodon-ui';
import TimeAgo from 'timeago-react';

interface props {
  content: string,
  style?: object,
  className?: string,
}

const TimePopover: React.FC<props> = memo(({ content, style, className }) => {
  const timestamp = content && typeof content === 'string'
    ? Math.min(Date.now(), new Date(content.replace(/-/g, '/')).getTime())
    : false;

  return (
    <div style={style} className={`${className || ''}`}>
      <Tooltip
        title={content}
      >
        <TimeAgo
          datetime={timestamp || content}
          locale="zh_CN"
        />
      </Tooltip>
    </div>
  );
});

export default TimePopover;
