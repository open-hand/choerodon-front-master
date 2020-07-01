import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';

const Backlog = memo(({
  imageUrl,
  realName = '王王王',
  roles = ['admin', 'admin'],
}) => {
  const [url, setUrl] = useState(0);
  const renderIssueTag = (issuesCount = [{ task: 3, name: '任务' }, { bug: 3, name: '缺陷' }, { bug: 5, name: '延期' }]) => issuesCount.map(
    (item) => <div><span className={`c7n-project-overview-backlog-${item.bug ? 'bug' : 'task'}`}>{item.name}</span>{item.bug || item.task}</div>,
  );
  return (
    <div className="c7n-project-overview-backlog">
      <label>待办事项</label>
      {renderIssueTag()}
    </div>

  );
});

export default Backlog;
