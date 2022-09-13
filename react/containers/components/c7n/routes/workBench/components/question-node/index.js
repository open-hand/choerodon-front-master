import React, {
  useReducer, useState, useEffect,
} from 'react';
import {
  Icon, Tooltip,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import queryString from 'query-string';
import { merge, get } from 'lodash';
import { TypeTag } from '@choerodon/components';
import { getRandomBackground } from '@/utils';
import './index.less';
import { ALL_TYPE_CODES } from '@/constants/STATUS_TYPE';
import { useWorkBenchStore } from '../../stores';

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

const QuestionNode = observer(({
  history, record, organizationId, switchCode, isStar, onClickStar, dataSet,
}) => {
  const {
    projectVO, typeCode, issueTypeVO, issueNum, summary, priorityVO: customPriorityVO,
    backlogPriority, statusVO, assigneeId, featureType, backlogNum,
    assigneeImageUrl, assigneeRealName, assignees, featureTeams, starBeacon, issueId, id,
    projectId: topProjectId, projectName: topProjectName, ...otherData
  } = record || {};
  const { code: statusCode } = statusVO || {};
  const { openCurrent, closeCurrent } = useWorkBenchStore();
  const prefixCls = 'c7ncd-question-issue';
  useEffect(() => {
  }, []);
  const priorityVO = customPriorityVO || (backlogPriority && { colour: backlogPriority.color, name: backlogPriority.name });
  function handleExecuteClick() {
    const { id: projectId, name: projectName } = projectVO || {};
    const queryData = {
      id: projectId || topProjectId,
      name: projectName || topProjectName,
      organizationId,
      type: 'project',
    };
    // if (switchCode === 'myStarBeacon_backlog') {
    //   const { code } = statusVO;
    //   let pathSuffix = 'demand';
    //   if (code === 'backlog_rejected') {
    //     pathSuffix += '/approve';
    //     merge(queryData, { paramBacklogStatus: statusCode });
    //   }
    //   merge(queryData, { paramBacklogId: id, paramBacklogName: backlogNum });
    //   window.open(`#/agile/${pathSuffix}?${queryString.stringify(queryData)}`);
    //   return;
    // }
    // if (switchCode === 'myStarBeacon') {
    //   if (typeCode !== 'feature') {
    //     merge(queryData, { paramIssueId: issueId, paramName: issueNum });

    //     window.open(`#/agile/work-list/issue?${queryString.stringify(queryData)}`);
    //   } else {
    //     merge(queryData, { paramIssueId: issueId, paramName: issueNum, category: 'PROGRAM' });
    //     window.open(`#/agile/feature?${queryString.stringify(queryData)}`);
    //   }
    //   return;
    // }
    // if (typeCode === 'test-execution') {
    const {
      planId, executeId, cycleId, assignedTo,
    } = otherData;
    merge(queryData, { cycle_id: cycleId, plan_id: planId, assignerId: assignedTo });
    window.open(`#/testManager/TestPlan/execute/${executeId}?${queryString.stringify(queryData)}`);

    // return;
    // }
    // window.open(`#/agile/scrumboard?${queryString.stringify(merge(queryData, { paramIssueId: issueId }))}`);
  }

  const handleClick = () => {
    if (record.issueId || record.id) {
      openCurrent({
        path: backlogNum ? 'demand' : 'issue',
        props: backlogNum ? { id: record.id, projectId: record.projectId, organizationId } : {
          issueId: record.issueId,
          projectId: record.projectId,
          applyType: ALL_TYPE_CODES.includes(record.issueTypeVO.typeCode) ? 'waterfall' : 'agile',
        },
        events: {
          update: () => {
            dataSet.query();
          },
        },
      });
    } else {
      closeCurrent();
    }
  };

  function getIssueType(originTypeCode, isBacklogType = false) {
    let mes = '';
    let icon = '';
    let color = '';
    let otherStyle = {};
    const newTypeCode = isBacklogType ? 'backlog' : originTypeCode;
    switch (newTypeCode) {
      case 'story':
        mes = '故事';
        icon = 'agile_story';
        color = '#00bfa5';
        break;
      case 'bug':
        mes = '缺陷';
        icon = 'bug_report';
        color = '#f44336';
        break;
      case 'issue_epic':
        mes = '史诗';
        icon = 'bolt';
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
        icon = 'done';
        color = '#4d90fe';
    }
    if (issueTypeVO && newTypeCode !== 'feature') {
      if (issueTypeVO.name !== mes) {
        mes = issueTypeVO.name;
        icon = issueTypeVO.icon;
        color = issueTypeVO.colour;
      }
    }
    let otherClassName = '';
    if (newTypeCode !== 'test-execution') {
      otherStyle = {
        background: color,
      };
      color = 'white';
      otherClassName = `${prefixCls}-main-icon-other`;
    }
    return (
      <Tooltip title={mes} placement="top">
        {typeCode === 'backlog' ? (
          <div style={{
            backgroundColor: color, width: '.16rem', height: '.16rem', flexShrink: 0, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          >
            <Icon
              className={`${prefixCls}-main-icon`}
              type={icon}
              style={{
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </div>
        ) : (
          <Icon
            className={`${prefixCls}-main-icon ${otherClassName}`}
            type={icon}
            style={{ ...otherStyle, color }}
          />
        )}
      </Tooltip>
    );
  }

  function getStatus() {
    const { type, name, colour } = statusVO || {};
    return (
      <Tooltip title={name} placement="top">
        <span
          className={`${prefixCls}-main-status ${prefixCls}-main-status-${type}`}
          style={{ backgroundColor: colour }}
        >
          {name}
        </span>
      </Tooltip>
    );
  }
  function getUser(userInfo = {}, hiddenName = false, tooltipText, tooltipTheme = 'dark') {
    const {
      id: userId,
      imageUrl,
      name,
      realName,
    } = userInfo;
    return userId && (
      <Tooltip theme={tooltipTheme} title={<div className={`${prefixCls}-main-user-tooltip`}>{tooltipText || realName}</div>} placement="top">
        <span className={`${prefixCls}-main-user ${hiddenName ? `${prefixCls}-main-user-hover` : ''}`}>
          <div className={`${prefixCls}-main-user-left`} style={{ marginRight: id === 'more' ? 0 : undefined, backgroundImage: imageUrl ? `url('${imageUrl}')` : 'unset' }}>{!imageUrl && (name || getFirst(realName))}</div>
          {!hiddenName && <span className={`${prefixCls}-main-user-right`} style={{ color: id === 'more' ? 'inherit' : undefined }}>{realName}</span>}
        </span>
      </Tooltip>
    );
  }
  function getUsers(userInfos = [{}]) {
    return (
      <div className={`${prefixCls}-main-users`}>
        {userInfos.length > 1 ? userInfos.slice(0, 3).map((user) => getUser(user, true)) : getUser(userInfos[0])}
        {userInfos.length > 3 && getUser({ id: 'more', name: <Icon type="more_horiz" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /> }, true,
          <div className={`${prefixCls}-main-users-tooltip`}>
            {userInfos.slice(3).map((user) => <div>{getUser(user)}</div>)}
          </div>, 'light')}
      </div>
    );
  }
  function getProject(project = {}, hiddenName = false, tooltipText, tooltipTheme = 'dark') {
    const currentProjectId = get(project, 'id');
    const name = get(project, 'name');
    const imageUrl = get(project, 'imageUrl');
    const realId = get(project, 'realId');
    const realName = get(project, 'realName');
    return (currentProjectId || realId) && (
      <Tooltip theme={tooltipTheme} title={<div className={`${prefixCls}-main-project-tooltip`}>{tooltipText || name}</div>} placement="top">
        <span className={`${prefixCls}-main-project ${hiddenName ? `${prefixCls}-main-project-hover` : ''}`}>
          <div
            className={`${prefixCls}-main-project-left`}
            style={{
              color: realId ? 'var(--primary-color)' : undefined,
              marginRight: currentProjectId === 'more' ? 0 : undefined,
              backgroundColor: realId ? '#F0F5FF' : undefined,
              backgroundImage: imageUrl && currentProjectId ? `url('${imageUrl}')` : getRandomBackground(currentProjectId),
            }}
          >
            {!imageUrl && (realName || String(name).toLocaleUpperCase().substring(0, 1))}

          </div>
          {!hiddenName && <span className={`${prefixCls}-main-project-right`} style={{ color: currentProjectId === 'more' ? 'inherit' : undefined }}>{name}</span>}
        </span>
      </Tooltip>
    );
  }
  function getProjects(projects = []) {
    return projects.length > 0 ? (
      <div className={`${prefixCls}-main-projects`}>
        {projects.length > 1 ? projects.splice(0, 3).map((project) => getProject(project, true)) : getProject(projects[0])}
        {projects.length > 3 && getProject({ realId: 'more', realName: <Icon type="more_horiz" style={{ fontSize: 'inherit', lineHeight: 'inherit' }} /> }, true,
          <div className={`${prefixCls}-main-projects-tooltip`}>
            {projects.slice(3).map((project) => <div>{getProject(project)}</div>)}
          </div>, 'light')}
      </div>
    ) : '';
  }

  return (
    <div
      role="none"
      className={`${prefixCls}`}
      onClick={typeCode === 'test-execution' ? handleExecuteClick : handleClick}
      key={`${typeCode}-${issueId || id}`}
    >
      <div className={`${prefixCls}-main`}>
        <TypeTag data={issueTypeVO} featureType={featureType} />
        <Tooltip title={issueNum} placement="top">
          <span className={`${prefixCls}-main-issueId`}>{issueNum || backlogNum}</span>
        </Tooltip>
        <Tooltip title={summary} placement="top">
          <span className={`${prefixCls}-main-description`}>{summary}</span>
        </Tooltip>
        {isStar && starBeacon && (
        <Icon
          className={`${prefixCls}-main-star`}
          type="stars"
          onClick={(e) => {
            e.stopPropagation();
            onClickStar && onClickStar(record);
          }}
        />
        )}
        {getStatus()}
        {(switchCode === 'reportedBug' || (isStar && typeCode !== 'feature')) && getUsers(assignees || [{ id: assigneeId, imageUrl: assigneeImageUrl, realName: assigneeRealName }])}
        {typeCode === 'feature' && getProjects(featureTeams)}
        {typeCode !== 'feature' && (
          <span
            className={`${prefixCls}-main-priority`}
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
});

export default QuestionNode;
