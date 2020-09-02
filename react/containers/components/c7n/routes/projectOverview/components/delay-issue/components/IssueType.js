import React, { useState, memo, useMemo, useEffect } from 'react';
import { Button, Tooltip, Icon } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
// import './index.less';

const prefixCls = 'c7n-project-overview-delay-issue';
const IssueType = observer((typeCode) => {
  let mes = '';
  let icon = '';
  let color = '';
  switch (typeCode) {
    case 'story':
      mes = '故事';
      icon = 'agile_story';
      color = '#00bfa5';
      break;
    case 'bug':
      mes = '缺陷';
      icon = 'agile_fault';
      color = '#f44336';
      break;
    case 'issue_epic':
      mes = '史诗';
      icon = 'agile_epic';
      color = '#743be7';
      break;
    case 'sub_task':
      mes = '子任务';
      icon = 'agile_subtask';
      color = '#4d90fe';
      break;
    default:
      mes = '任务';
      icon = 'agile_task';
      color = '#4d90fe';
  }
  return (
    <Tooltip title={mes} placement="top">
      <Icon
        className={`${prefixCls}-item-issue-type`}
        type={icon}
        style={{ color }}
      />
    </Tooltip>
  );
});

export default IssueType;
