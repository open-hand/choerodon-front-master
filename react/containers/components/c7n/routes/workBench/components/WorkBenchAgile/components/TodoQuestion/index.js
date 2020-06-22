import React, { useEffect } from 'react';
import { Icon, Tooltip, Tree } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Card from '../../../card';
import { useWorkBenchStore } from '../../../../stores';
import EmptyPage from '../../../empty-page';
import LoadingBar from '../../../../../../tools/loading-bar';

import './index.less';

const TodoQuestion = observer(() => {
  const {
    AppState: { currentMenuType: { organizationId } },
    questionDs,
    history,
  } = useWorkBenchStore();

  useEffect(() => {
    console.log(questionDs.totalPages);
  }, [questionDs.totalPages]);

  function handleClick(record) {
    const { projectVO, issueId } = record.toData();
    const { id: projectId, name: projectName } = projectVO || {};
    history.push({
      pathname: '/agile/scrumboard',
      search: `?id=${projectId}&name=${projectName}&organizationId=${organizationId}&type=project`,
      state: {
        issueId,
      },
    });
  }
  
  function getIssueType(typeCode) {
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
          className="c7n-todoQuestion-issueContent-issueItem-main-icon"
          type={icon}
          style={{ color }}
        />
      </Tooltip>
    );
  }

  function getStatus(statusVO) {
    const { type, name } = statusVO || {};
    return (
      <span
        className={`c7n-todoQuestion-issueContent-issueItem-main-status c7n-todoQuestion-issueContent-issueItem-main-status-${type}`}
      >
        {name}
      </span>
    );
  }
  
  function nodeRenderer({ record }) {
    const { projectVO, typeCode, issueNum, summary, priorityVO, statusVO } = record.toData() || {};
    return (
      <div className="c7n-todoQuestion-issueContent-issueItem" onClick={() => handleClick(record)}>
        <p className="c7n-todoQuestion-issueContent-issueItem-project">{projectVO ? projectVO.name : ''}</p>
        <div className="c7n-todoQuestion-issueContent-issueItem-main">
          {getIssueType(typeCode)}
          <span className="c7n-todoQuestion-issueContent-issueItem-main-issueId">{issueNum}</span>
          <Tooltip title={summary} placement="top">
            <span className="c7n-todoQuestion-issueContent-issueItem-main-description">{summary}</span>
          </Tooltip>
          {getStatus(statusVO)}
          <span className="c7n-todoQuestion-issueContent-issueItem-main-priority">
            {priorityVO ? priorityVO.name : '无'}
          </span>
        </div>
      </div>
    );
  }

  function getContent() {
    if (!questionDs || questionDs.status === 'loading') {
      return <LoadingBar display />;
    }
    if (!questionDs.length) {
      return (
        <EmptyPage
          title="暂无待办问题"
          describe="当前迭代暂无待办问题"
        />
      );
    }
    return (
      <Tree
        dataSet={questionDs}
        renderer={nodeRenderer}
        // onExpand={handleExpanded}
        className="c7n-todoQuestion-issueContent"
      />
    );
  }

  return (
    <div className="c7n-todoQuestion">
      <Card
        title="待办问题"
        showCount
        count={questionDs ? questionDs.length : 0}
        className="c7n-todoQuestion-issueContent"
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
