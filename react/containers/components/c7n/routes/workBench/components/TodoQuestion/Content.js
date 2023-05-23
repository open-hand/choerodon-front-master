import React, {
  useEffect, useState, useReducer, Fragment, useMemo,
} from 'react';
import {
  Icon, Tooltip, Tree, Dropdown, Menu,
} from 'choerodon-ui/pro';
import { get } from '@choerodon/inject';

import { Spin } from 'choerodon-ui';
import { merge } from 'lodash';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import { Loading } from '@zknow/components';
import { getRandomBackground } from '@/utils';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import Switch from '@/containers/components/c7n/routes/workBench/components/multiple-switch';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';

import './index.less';
import { useWorkBenchStore } from '../../stores';

const HAS_BACKLOG = C7NHasModule('@choerodon/backlog');

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
    formatWorkbench,
    formatCommon,
  } = useWorkBenchStore();

  const {
    organizationId,
    questionDs,
    history,
    workBenchUseStore,
  } = useTodoQuestionStore();

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
  const [switchCode, setSwitchCode] = useReducer((state, action) => {
    const { type, ...restAction } = action;
    switch (type) {
      case 'init':
        return {
          backlogCode: 'myStarBeacon',
          switchCode: 'all',
        };
      case 'change':
        return {
          ...state,
          backlogCode: 'myStarBeacon',
          ...restAction,
        };
      default:
        return state;
    }
  }, {
    code: 'all',
    backlogCode: 'myStarBeacon',
  });
  const emptyPrompt = useMemo(() => {
    let title = formatWorkbench({ id: 'noTodo' });
    let describe = formatWorkbench({ id: 'noTodo.desc' });
    if (switchCode.code === 'reportedBug') {
      title = '暂无已提缺陷';
      describe = '当前迭代您尚未提交任何缺陷';
    } else if (switchCode.code === 'myStarBeacon') {
      [title, describe] = switchCode.backlogCode === 'myStarBeacon' ? ['暂无我关注的问题', '您尚未关注任何问题项'] : ['暂无我关注的需求', '您尚未关注任何需求'];
    }
    return { title, describe };
  }, [switchCode.backlogCode, switchCode.code]);

  async function loadData(newPage) {
    try {
      const oldData = questionDs.toData();
      const { id: projectId } = workBenchUseStore.getActiveStarProject || {};
      // HAS_BACKLOG &&
      const res = switchCode.backlogCode === 'myStarBeacon_backlog' ? await workBenchUseStore.loadBacklogs({ organizationId, projectId, page: newPage || 1 })
        : await workBenchUseStore.loadQuestions({
          organizationId, projectId, page: newPage || 1, type: switchCode.code === 'all' ? undefined : switchCode.code,
        });
      if (res && !res.failed) {
        if (res.totalElements && (res.number + 1) < res.totalPages) {
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
    const {
      projectVO, issueId, id, statusVO, typeCode, issueNum, backlogNum, statusVO: { code: statusCode }, projectId: topProjectId, projectName: topProjectName,
    } = record.toData();
    const { id: projectId, name: projectName } = projectVO || {};
    const queryData = {
      id: projectId || topProjectId,
      name: projectName || topProjectName,
      organizationId,
      type: 'project',
    };
    if (switchCode.code !== 'myStarBeacon') {
      history.push({
        pathname: '/agile/scrumboard',
        search: `?${queryString.stringify(queryData)}`,
        state: {
          issueId,
        },
      });
    } else if (switchCode.backlogCode === 'myStarBeacon_backlog') {
      const { code } = statusVO;
      let pathSuffix = 'demand';
      if (code === 'backlog_rejected') {
        pathSuffix += '/approve';
        merge(queryData, { paramBacklogStatus: statusCode });
      }
      merge(queryData, { paramBacklogId: id, paramBacklogName: backlogNum });
      history.push({
        pathname: `/agile/${pathSuffix}`,
        search: `?${queryString.stringify(queryData)}`,
        state: {
          backlogId: id,
        },
      });
    } else if (typeCode !== 'feature') {
      merge(queryData, { paramIssueId: issueId, paramName: issueNum });
      history.push({
        pathname: '/agile/work-list/issue',
        search: `?${queryString.stringify(queryData)}`,
      });
    } else {
      merge(queryData, { paramIssueId: issueId, paramName: issueNum, category: 'PROGRAM' });

      history.push({
        pathname: '/agile/feature',
        search: `?${queryString.stringify(queryData)}`,
      });
    }
  }

  function getIssueType(originTypeCode, featureType, isBacklogType = false) {
    let mes = '';
    let icon = '';
    let color = '';
    const typeCode = isBacklogType ? 'backlog' : originTypeCode;
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
      case 'backlog':
        mes = '需求';
        icon = 'highlight';
        color = '#f67f5a';
        break;
      case 'feature': {
        const featureTypeResult = featureType === 'business';
        mes = featureTypeResult ? '特性' : '使能';
        icon = featureTypeResult ? 'characteristic' : 'agile-feature';
        color = featureTypeResult ? '#3D5AFE' : '#FFCA28';
        break;
      }
      default:
        mes = '任务';
        icon = 'agile_task';
        color = '#4d90fe';
    }

    return (
      <Tooltip title={mes} placement="top">
        {typeCode === 'backlog' || featureType === 'business' ? (
          <div style={{
            backgroundColor: color, width: '.16rem', height: '.16rem', flexShrink: 0, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          >
            <Icon
              className="c7n-todoQuestion-issueContent-issueItem-main-icon"
              type={icon}
              style={{ color: '#fff', fontSize: '12px' }}
            />
          </div>
        ) : (
          <Icon
            className="c7n-todoQuestion-issueContent-issueItem-main-icon"
            type={icon}
            style={{ color }}
          />
        )}

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
  function getUser(userInfo = {}, hiddenName = false, tooltipText, tooltipTheme = 'dark') {
    const {
      id,
      imageUrl,
      loginName,
      name,
      realName,
    } = userInfo;
    return id && (
      <Tooltip theme={tooltipTheme} title={<div className="c7n-todoQuestion-issueContent-issueItem-main-user-tooltip">{tooltipText || realName}</div>} placement="top">
        <span className={`c7n-todoQuestion-issueContent-issueItem-main-user ${hiddenName ? 'c7n-todoQuestion-issueContent-issueItem-main-user-hover' : ''}`}>
          <div className="c7n-todoQuestion-issueContent-issueItem-main-user-left" style={{ marginRight: id === 'more' ? 0 : undefined, backgroundImage: imageUrl ? `url('${imageUrl}')` : 'unset' }}>{!imageUrl && (name || getFirst(realName))}</div>
          {!hiddenName && <span className="c7n-todoQuestion-issueContent-issueItem-main-user-right" style={{ color: id === 'more' ? 'inherit' : undefined }}>{realName}</span>}
        </span>
      </Tooltip>
    );
  }
  function getUsers(userInfos = [{}]) {
    return (
      <div className="c7n-todoQuestion-issueContent-issueItem-main-users">
        {userInfos.length > 1 ? userInfos.slice(0, 3).map((user) => getUser(user, true)) : getUser(userInfos[0])}
        {userInfos.length > 3 && getUser({ id: 'more', name: <Icon type="more_horiz" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /> }, true,
          <div className="c7n-todoQuestion-issueContent-issueItem-main-users-tooltip">
            {userInfos.slice(3).map((user) => <div>{getUser(user)}</div>)}
          </div>, 'light')}
      </div>
    );
  }
  function getProject(project = {}, hiddenName = false, tooltipText, tooltipTheme = 'dark') {
    const {
      id, name, imageUrl, realId, realName,
    } = project;
    return (id || realId) && (
      <Tooltip theme={tooltipTheme} title={<div className="c7n-todoQuestion-issueContent-issueItem-main-project-tooltip">{tooltipText || name}</div>} placement="top">
        <span className={`c7n-todoQuestion-issueContent-issueItem-main-project ${hiddenName ? 'c7n-todoQuestion-issueContent-issueItem-main-project-hover' : ''}`}>
          <div
            className="c7n-todoQuestion-issueContent-issueItem-main-project-left"
            style={{
              color: realId ? 'var(--primary-color)' : undefined,
              marginRight: id === 'more' ? 0 : undefined,
              backgroundColor: realId ? '#F0F5FF' : undefined,
              backgroundImage: imageUrl && id ? `url('${imageUrl}')` : getRandomBackground(id),
            }}
          >
            {!imageUrl && (realName || String(name).toLocaleUpperCase().substring(0, 1))}

          </div>
          {!hiddenName && <span className="c7n-todoQuestion-issueContent-issueItem-main-project-right" style={{ color: id === 'more' ? 'inherit' : undefined }}>{name}</span>}
        </span>
      </Tooltip>
    );
  }
  function getProjects(projects = []) {
    return projects.length > 0 ? (
      <div className="c7n-todoQuestion-issueContent-issueItem-main-projects">
        {projects.length > 1 ? projects.splice(0, 3).map((project) => getProject(project, true)) : getProject(projects[0])}
        {projects.length > 3 && getProject({ realId: 'more', realName: <Icon type="more_horiz" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /> }, true,
          <div className="c7n-todoQuestion-issueContent-issueItem-main-projects-tooltip">
            {projects.slice(3).map((project) => <div>{getProject(project)}</div>)}
          </div>, 'light')}
      </div>
    ) : '';
  }
  function nodeRenderer({ record }) {
    const {
      projectVO, projectName, typeCode, issueNum, summary, priorityVO: customPriorityVO, backlogPriority, statusVO, assigneeId, featureType, backlogNum,
      assigneeImageUrl, assigneeRealName, assignees, featureTeams, starBeacon, issueId, id,
    } = record.toData() || {};
    const priorityVO = customPriorityVO || (backlogPriority && { colour: backlogPriority.color, name: backlogPriority.name });
    return (
      <div role="none" className="c7n-todoQuestion-issueContent-issueItem" onClick={() => handleClick(record)} key={`${typeCode}-${issueId || id}`}>
        <p className="c7n-todoQuestion-issueContent-issueItem-project">{projectVO ? projectVO.name : projectName || ''}</p>
        <div className="c7n-todoQuestion-issueContent-issueItem-main">
          {getIssueType(typeCode, featureType, !!backlogNum)}
          <Tooltip title={issueNum} placement="top">
            <span className="c7n-todoQuestion-issueContent-issueItem-main-issueId">{issueNum || backlogNum}</span>
          </Tooltip>
          <Tooltip title={summary} placement="top">
            <span className="c7n-todoQuestion-issueContent-issueItem-main-description">{summary}</span>
          </Tooltip>
          {switchCode.code === 'myStarBeacon' && starBeacon && <Icon className="c7n-todoQuestion-issueContent-issueItem-main-star" type="stars" />}
          {getStatus(statusVO)}
          {(switchCode.code === 'reportedBug' || (switchCode.code === 'myStarBeacon' && typeCode !== 'feature')) && getUsers(assignees || [{ id: assigneeId, imageUrl: assigneeImageUrl, realName: assigneeRealName }])}
          {typeCode === 'feature' && getProjects(featureTeams)}
          {typeCode !== 'feature' && (
            <span
              className="c7n-todoQuestion-issueContent-issueItem-main-priority"
              style={{
                backgroundColor: `${priorityVO ? priorityVO.colour : '#FFFFFF'}1F`,
                color: priorityVO ? priorityVO.colour : '#FFFFFF',
              }}
            >
              {priorityVO ? priorityVO.name : '无'}
            </span>
          )}
        </div>
      </div>
    );
  }
  function getContent() {
    if (!questionDs || questionDs.status === 'loading' || loading) {
      return <Loading display type={get('configuration.master-global:loadingType') || 'c7n'} />;
    }
    if (!questionDs.length) {
      return (
        <EmptyPage
          title={emptyPrompt.title}
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>{emptyPrompt.describe}</span>}
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
  const renderStarMenu = () => (
    <Menu onClick={({ key }) => setSwitchCode({ type: 'change', code: 'myStarBeacon', backlogCode: key })}>
      <Menu.Item key="myStarBeacon_backlog">{formatCommon({ id: 'demand' })}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="myStarBeacon">{formatCommon({ id: 'issue' })}</Menu.Item>
    </Menu>
  );
  const renderTitle = () => (
    <div className="c7n-todoQuestion-title">
      <div className="c7n-todoQuestion-title-left">
        我的事项
        <span>{totalCount}</span>
      </div>
      <Switch
        defaultValue="all"
        value={switchCode.code}
        options={[{ value: 'all', text: '所有待办' },
          {
            value: 'myStarBeacon',
            text: (<Dropdown overlay={window.agile ? renderStarMenu() : undefined}><span>{formatWorkbench({ id: 'myAttention' })}</span></Dropdown>),
          },
          { value: 'reportedBug', text: '已提缺陷' },
          { value: 'myBug', text: '待修复缺陷' }]}
        onChange={(v) => (!window.agile || v !== 'myStarBeacon' ? setSwitchCode({ type: 'change', code: v }) : false)}
      />
    </div>
  );

  return (
    <div className="c7n-todoQuestion">
      <Card
        title={renderTitle()}
        className="c7n-todoQuestion-issueContent"
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
