import React, {
  useEffect, useState, useReducer, Fragment,
} from 'react';
import {
  Icon, Tooltip, Tree, UrlField, Dropdown, Menu,
} from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { merge } from 'lodash';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import { Button } from 'choerodon-ui/lib/radio';
import { getRandomBackground } from '@/containers/components/c7n/util';
import Card from '../../../card';
import { useWorkBenchStore } from '../../../../stores';
import EmptyPage from '../../../empty-page';
import LoadingBar from '../../../../../../tools/loading-bar';
import Switch from '../../../multiple-switch';
import './index.less';

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
      projectVO, issueId, id, statusVO, typeCode, backlogNum, statusVO: { code: statusCode }, projectId: topProjectId, projectName: topProjectName,
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
      if (code === 'backlog_pending_approval' || code === 'backlog_rejected') {
        pathSuffix += '-approve';
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
      merge(queryData, { paramIssueId: issueId });
      history.push({
        pathname: '/agile/work-list/issue',
        search: `?${queryString.stringify(queryData)}`,
      });
    } else {
      merge(queryData, { paramIssueId: issueId, category: 'PROGRAM' });

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
  function getUser(userInfo = {}, hiddenName = false, tooltipText) {
    const {
      id,
      imageUrl,
      loginName,
      name,
      realName,
    } = userInfo;
    return id && (
      <Tooltip title={<div className="c7n-todoQuestion-issueContent-issueItem-main-user-tooltip">{tooltipText || realName}</div>} placement="top">
        <span className="c7n-todoQuestion-issueContent-issueItem-main-user">
          <div className="c7n-todoQuestion-issueContent-issueItem-main-user-left" style={{ marginRight: id === 'more' ? 0 : undefined, backgroundImage: imageUrl ? `url('${imageUrl}')` : 'unset' }}>{!imageUrl && (name || getFirst(realName))}</div>
          {!hiddenName && <span className="c7n-todoQuestion-issueContent-issueItem-main-user-right" style={{ color: id === 'more' ? 'inherit' : undefined }}>{realName}</span>}
        </span>
      </Tooltip>
    );
  }
  function getUsers(userInfos = [{}]) {
    return (
      <div className="c7n-todoQuestion-issueContent-issueItem-main-users">
        {userInfos.length > 1 ? userInfos.slice(0, 2).map((user) => getUser(user, true)) : getUser(userInfos[0])}
        {userInfos.length > 2 && getUser({ id: 'more', name: '...' }, true, userInfos.slice(2).map((user) => [getUser(user), <br />]))}
      </div>
    );
  }
  function getProject(project = {}, hiddenName = false, tooltipText) {
    const {
      id, name, imageUrl, realId, realName,
    } = project;
    return (id || realId) && (
      <Tooltip title={<div className="c7n-todoQuestion-issueContent-issueItem-main-project-tooltip">{tooltipText || name}</div>} placement="top">
        <span className="c7n-todoQuestion-issueContent-issueItem-main-project">
          <div
            className="c7n-todoQuestion-issueContent-issueItem-main-project-left"
            style={{
              color: realId ? '#5365EA' : undefined,
              marginRight: id === 'more' ? 0 : undefined,
              backgroundColor: realId ? '#F0F5FF' : undefined,
              backgroundImage: imageUrl && id ? `url('${imageUrl}')` : getRandomBackground(id),
            }}
          >
            {!imageUrl && (realName || getFirst(name))}

          </div>
          {!hiddenName && <span className="c7n-todoQuestion-issueContent-issueItem-main-project-right" style={{ color: id === 'more' ? 'inherit' : undefined }}>{name}</span>}
        </span>
      </Tooltip>
    );
  }
  function getProjects(projects = []) {
    return projects.length > 0 ? (
      <div className="c7n-todoQuestion-issueContent-issueItem-main-projects">
        {projects.length > 1 ? projects.splice(0, 2).map((project) => getProject(project, true)) : getProject(projects[0])}
        {projects.length > 2 && getProject({ realId: 'more', realName: '...' }, true, projects.slice(2).map((project) => [getProject(project), <br />]))}
      </div>
    ) : '';
  }
  function nodeRenderer({ record }) {
    const {
      projectVO, projectName, typeCode, issueNum, summary, priorityVO: customPriorityVO, backlogPriority, statusVO, assigneeId, featureType, backlogNum,
      assigneeImageUrl, assigneeRealName, assignees, featureTeams,
    } = record.toData() || {};
    const priorityVO = customPriorityVO || backlogPriority;
    return (
      <div role="none" className="c7n-todoQuestion-issueContent-issueItem" onClick={() => handleClick(record)}>
        <p className="c7n-todoQuestion-issueContent-issueItem-project">{projectVO ? projectVO.name : projectName || ''}</p>
        <div className="c7n-todoQuestion-issueContent-issueItem-main">
          {getIssueType(typeCode, featureType, !!backlogNum)}
          <Tooltip title={issueNum} placement="top">
            <span className="c7n-todoQuestion-issueContent-issueItem-main-issueId">{issueNum || backlogNum}</span>
          </Tooltip>
          <Tooltip title={summary} placement="top">
            <span className="c7n-todoQuestion-issueContent-issueItem-main-description">{summary}</span>
          </Tooltip>
          {switchCode.code === 'myStarBeacon' && <Icon className="c7n-todoQuestion-issueContent-issueItem-main-star" type="star_border" />}
          {getStatus(statusVO)}
          {(switchCode.code === 'reportedBug' || (switchCode.code === 'myStarBeacon' && typeCode !== 'feature')) && getUsers(assignees || [{ assigneeId, assigneeImageUrl, assigneeRealName }])}
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
  const renderStarMenu = () => (
    <Menu onClick={({ key }) => setSwitchCode({ type: 'change', code: 'myStarBeacon', backlogCode: key })}>
      <Menu.Item key="myStarBeacon_backlog">需求</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="myStarBeacon">问题</Menu.Item>
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
            text: (<Dropdown overlay={HAS_BACKLOG ? renderStarMenu() : undefined}><span>我的关注</span></Dropdown>),
          },
          { value: 'reportedBug', text: '已提缺陷' },
          { value: 'myBug', text: '待修复缺陷' }]}
        onChange={(v) => (!HAS_BACKLOG || v !== 'myStarBeacon' ? setSwitchCode({ type: 'change', code: v }) : false)}
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
