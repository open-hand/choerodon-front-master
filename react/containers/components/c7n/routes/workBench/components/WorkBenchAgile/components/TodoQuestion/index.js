import React, { useEffect, useState, Fragment } from 'react';
import { Icon, Tooltip, Tree } from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
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
    workBenchUseStore,
  } = useWorkBenchStore();

  const [page, changePage] = useState(1);
  const [showMore, changeShowMore] = useState(false);
  const [btnLoading, changeBtnLoading] = useState(false);
  const [loading, changeLoading] = useState(false);

  async function loadData(newPage) {
    try {
      const oldData = questionDs.toData();
      const { id: projectId } = workBenchUseStore.getActiveStarProject || {};
      const res = await workBenchUseStore.loadQuestions({ organizationId, projectId, page: newPage || 1 });
      if (res && !res.failed) {
        if (res.totalElements && res.number < res.totalPages) {
          changeShowMore(true);
        } else {
          changeShowMore(false);
        }
        questionDs.loadData(oldData.concat(res.content));
      }
      changeBtnLoading(false);
      changeLoading(false);
    } catch (e) {
      changeShowMore(true);
      changePage(1);
      changeBtnLoading(false);
      changeLoading(false);
    }
  }

  useEffect(() => {
    changeLoading(true);
    questionDs.removeAll();
    changePage(1);
    loadData();
  }, [workBenchUseStore.getActiveStarProject, organizationId]);
  
  function loadMoreData() {
    const newPage = page + 1;
    changeBtnLoading(true);
    loadData(newPage);
    changePage(newPage);
  }

  function handleClick(record) {
    const { projectVO, issueId } = record.toData();
    const { id: projectId, name: projectName } = projectVO || {};
    history.push({
      pathname: '/agile/scrumboard',
      search: `?id=${projectId}&name=${encodeURIComponent(projectName)}&organizationId=${organizationId}&type=project`,
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
          <Tooltip title={issueNum} placement="top">
            <span className="c7n-todoQuestion-issueContent-issueItem-main-issueId">{issueNum}</span>
          </Tooltip>
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
    if (!questionDs || questionDs.status === 'loading' || loading) {
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
      <Fragment>
        <Tree
          dataSet={questionDs}
          renderer={nodeRenderer}
          className="c7n-todoQuestion-issueContent"
        />
        {showMore ? (btnLoading ? (
          <Spin spinning />
          ) : (
            <div
              onClick={() => loadMoreData()}
              className="c7n-todoQuestion-issueContent-more"
            >
              加载更多
            </div>
          )
        ) : null}
      </Fragment>
    );
  }

  return (
    <div className="c7n-todoQuestion">
      <Card
        title="待办问题"
        showCount
        // count={totalCount}
        className="c7n-todoQuestion-issueContent"
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
