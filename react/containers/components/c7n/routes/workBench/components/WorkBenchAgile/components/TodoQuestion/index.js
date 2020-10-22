import React, {
  useEffect, useState, useReducer, Fragment,
} from 'react';
import {
  Icon, Tooltip, Tree, UrlField,
} from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import Card from '../../../card';
import { useWorkBenchStore } from '../../../../stores';
import EmptyPage from '../../../empty-page';
import LoadingBar from '../../../../../../tools/loading-bar';
import Switch from '../../../multiple-switch';
import './index.less';

function getFirst(str) {
  if (!str) {
    return '';
  }
  const re = /[\u4E00-\u9FA5]/g;
  for (let i = 0, len = str.length; i < len; i += 1) {
    if (re.test(str[i])) {
      return str[i];
    }
  }
  return str[0];
}
const TodoQuestion = observer(() => {
  const {
    AppState: { currentMenuType: { organizationId } },
    questionDs,
    history,
    workBenchUseStore,
  } = useWorkBenchStore();
  const [pageInfo, change] = useReducer((state, action) => {
    const { type, ...other } = action;
    switch (type) {
      case 'init':
        return {
          page: 1,
          showMore: false,
          totalCount: 0,
        };
      case 'load':
        return { ...other };
      case 'error':
        return {
          page: 1,
          showMore: true,
          totalCount: 0,
        };
      default:
        return state;
    }
  }, {
    page: 1,
    showMore: true,
    totalCount: 0,
  });
  const { page, showMore, totalCount } = pageInfo;
  const [btnLoading, changeBtnLoading] = useState(false);
  const [loading, changeLoading] = useState(false);
  const [switchCode, setSwitchCode] = useState('all');
  async function loadData(newPage) {
    try {
      const oldData = questionDs.toData();
      const { id: projectId } = workBenchUseStore.getActiveStarProject || {};
      const res = await workBenchUseStore.loadQuestions({
        organizationId, projectId, page: newPage || 1, type: switchCode === 'all' ? undefined : switchCode,
      });
      if (res && !res.failed) {
        if (res.totalElements && res.number < res.totalPages) {
          change({
            type: 'load', showMore: true, page: res.number + 1, totalCount: res.totalElements,
          });
        } else {
          change({
            type: 'load', showMore: false, page: res.number + 1, totalCount: res.totalElements,
          });
        }
        questionDs.loadData(oldData.concat(res.content));
      }
      changeBtnLoading(false);
      changeLoading(false);
    } catch (e) {
      change({
        type: 'error',
      });
      changeBtnLoading(false);
      changeLoading(false);
    }
  }

  useEffect(() => {
    changeLoading(true);
    questionDs.removeAll();
    loadData();
  }, [workBenchUseStore.getActiveStarProject, organizationId, switchCode]);

  function loadMoreData() {
    const newPage = page + 1;
    changeBtnLoading(true);
    loadData(newPage);
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
  function getUser(userInfo = {}) {
    const {
      assigneeId,
      assigneeImageUrl,
      assigneeLoginName,
      assigneeName,
      assigneeRealName,
    } = userInfo;
    return assigneeId && (
      <Tooltip title={assigneeRealName} placement="top">
        <span className="c7n-todoQuestion-issueContent-issueItem-main-user">
          <div className="c7n-todoQuestion-issueContent-issueItem-main-user-left" style={{ backgroundImage: assigneeImageUrl ? `url(${assigneeImageUrl})` : 'unset' }}>{getFirst(assigneeRealName)}</div>
          <span className="c7n-todoQuestion-issueContent-issueItem-main-user-right">{assigneeRealName}</span>
        </span>
      </Tooltip>
    );
  }
  function nodeRenderer({ record }) {
    const {
      projectVO, typeCode, issueNum, summary, priorityVO, statusVO, assigneeId,
      assigneeImageUrl, assigneeRealName,
    } = record.toData() || {};
    return (
      <div role="none" className="c7n-todoQuestion-issueContent-issueItem" onClick={() => handleClick(record)}>
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
          {switchCode === 'reportedBug' && getUser({ assigneeId, assigneeImageUrl, assigneeRealName })}
          <span
            className="c7n-todoQuestion-issueContent-issueItem-main-priority"
            style={{
              backgroundColor: `${priorityVO ? priorityVO.colour : '#FFFFFF'}1F`,
              color: priorityVO ? priorityVO.colour : '#FFFFFF',
            }}
          >
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
    let component = <Spin spinning />;
    if (!btnLoading) {
      component = (
        <div
          role="none"
          onClick={() => loadMoreData()}
          className="c7n-todoQuestion-issueContent-more"
        >
          加载更多
        </div>
      );
    }
    return (
      <>
        <Tree
          dataSet={questionDs}
          renderer={nodeRenderer}
          className="c7n-todoQuestion-issueContent"
        />
        {showMore ? component
          : null}
      </>
    );
  }
  const renderTitle = () => (
    <div className="c7n-todoQuestion-title">
      <div className="c7n-todoQuestion-title-left">
        我的事项
        <span>{totalCount}</span>
      </div>

      <Switch
        defaultValue="all"
        options={[{ value: 'all', text: '所有待办' }, { value: 'reportedBug', text: '已提缺陷' },
          { value: 'myBug', text: '待修复缺陷' }]}
        onChange={setSwitchCode}
      />
    </div>
  );
  return (
    <div className="c7n-todoQuestion">
      <Card
        title={renderTitle()}
        // showCount
        // count={totalCount}
        className="c7n-todoQuestion-issueContent"
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
