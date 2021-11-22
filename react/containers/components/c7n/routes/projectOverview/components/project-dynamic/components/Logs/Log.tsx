import { merge } from 'lodash';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
// @ts-ignore
import queryString from 'query-string';
import { IIssueType } from '@/types';
import AppState from '@/containers/stores/c7n/AppState';
import { IFieldMap } from './index';

export interface User {
  email: string
  enabled?: boolean
  id: string
  imageUrl: string | null
  ldap: boolean
  loginName: string
  realName: string
  name?: string
}

export interface ILog {
  logId: string,
  field: string,
  fieldName: string,
  oldString: string,
  oldValue: any,
  newString: string,
  newValue: any,
  createdBy: string
  createdByUser: User,
  creationDate: string
  newStatus?: string,
  trigger?: string,
  removeResolution?: boolean,
  resolutionChanged?: boolean,
  ruleName?: string,
  summary: string,
  num: string,
  issueTypeVO: IIssueType,
  statusVO: {
    code: string,
  }
  instanceId: string
  projectName: string
  projectId: string
}

interface LogProps {
  log: ILog,
  fieldsMap: IFieldMap,
}
const Log: React.FC<LogProps> = ({ log, fieldsMap }) => {
  const history = useHistory();

  const getFieldConfig = () => {
    const { field, fieldName } = log;
    if (fieldsMap.get(field)) {
      return fieldsMap.get(field);
    }
    return (
      {
        name: fieldName,
      }
    );
  };

  const linkToIssue = useCallback(() => {
    const {
      projectId, projectName, issueTypeVO, statusVO, instanceId, num,
    } = log;
    const queryData = {
      id: projectId,
      name: projectName,
      organizationId: AppState.currentMenuType.organizationId,
      type: 'project',
    };
    if (issueTypeVO?.typeCode === 'backlog') {
      const { code } = statusVO || {};
      let pathSuffix = 'demand';
      if (code === 'backlog_rejected') {
        pathSuffix += '/approve';
        merge(queryData, { paramBacklogStatus: code });
      }
      merge(queryData, { paramBacklogId: instanceId, paramBacklogName: num });
      history.push({
        pathname: `/agile/${pathSuffix}`,
        search: `?${queryString.stringify(queryData)}`,
        state: {
          backlogId: instanceId,
        },
      });
      return;
    }
    if (issueTypeVO?.typeCode !== 'feature') {
      merge(queryData, { paramIssueId: instanceId, paramName: num });
      history.push({
        pathname: '/agile/work-list/issue',
        search: `?${queryString.stringify(queryData)}`,
      });
    } else {
      merge(queryData, { paramIssueId: instanceId, paramName: num, category: 'PROGRAM' });
      history.push({
        pathname: '/agile/feature',
        search: `?${queryString.stringify(queryData)}`,
      });
    }
  }, [history, log]);

  const renderCreateDefault = () => {
    const {
      newString, oldString, summary, num, issueTypeVO,
    } = log;
    const fieldConfig = getFieldConfig();
    return fieldConfig && (
    <>
      <span className="c7n-Log-operation">{fieldConfig.create?.operation || '更新'}</span>
      <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
      <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
      <span className="c7n-Log-operation">的</span>
      <span className="c7n-Log-field">{`【${fieldConfig.name}】`}</span>
      {
        !(fieldConfig.create && fieldConfig.create.hidden) && (
          <>
            <span className="c7n-Log-operation">为</span>
            <span className="c7n-Log-value">{`【${fieldConfig.create?.transform ? fieldConfig.create.transform({ newString, oldString }) : newString}】`}</span>
          </ >
        )
     }
    </>
    );
  };

  const renderUpdateDefault = () => {
    const {
      oldString, newString, summary, num, issueTypeVO,
    } = log;
    const fieldConfig = getFieldConfig();
    return fieldConfig && (
    <>
      {
        !(fieldConfig.update && fieldConfig.update.hidden) ? (
          <>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">{`【${fieldConfig.name}】`}</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${fieldConfig.update?.transform ? fieldConfig.update.transform({ oldString }) : oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${fieldConfig.update?.transform ? fieldConfig.update.transform({ newString }) : newString}】`}</span>
          </>
        ) : (
          <>
            <span className="c7n-Log-operation">{fieldConfig.update?.operation || '更新'}</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">{`【${fieldConfig.name}】`}</span>
          </>
        )
    }
    </>
    );
  };

  const renderDeleteDefault = () => {
    const {
      oldString, newString, summary, num, issueTypeVO,
    } = log;
    const fieldConfig = getFieldConfig();
    return fieldConfig && (
    <>
      <span className="c7n-Log-operation">{fieldConfig.delete?.operation || '移除'}</span>
      <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
      <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
      <span className="c7n-Log-operation">的</span>
      <span className="c7n-Log-field">{`【${fieldConfig.name}】`}</span>
      {
          !(fieldConfig.delete && fieldConfig.delete.hidden) && (
            <span className="c7n-Log-value">{`【${fieldConfig.delete?.transform ? fieldConfig.delete.transform({ newString, oldString }) : oldString}】`}</span>
          )
      }
    </>
    );
  };

  const fieldConfig = getFieldConfig();
  const {
    oldValue, newValue, oldString, newString,
  } = log;

  if (fieldConfig) {
    const createDontJudge = fieldConfig.create?.dontJudge;
    const updateDontJudge = fieldConfig.update?.dontJudge;
    const deleteDontJudge = fieldConfig.delete?.dontJudge;

    const createCondition = fieldConfig.create?.condition;
    const updateCondition = fieldConfig.update?.condition;
    const deleteCondition = fieldConfig.delete?.condition;

    const oldV = oldValue || oldString;
    const newV = newValue || newString;
    const renderLog = () => {
      const isCreate = Boolean((!oldV && String(oldV) !== '0') && (newV || String(newV) === '0'));
      const isUpdate = Boolean((oldV || String(oldV) === '0') && (newV || String(newV) === '0'));
      const isDelete = Boolean((oldV || String(oldV) === '0') && (!newV && String(newV) !== '0'));

      if (!createDontJudge && (createCondition?.({ newString, oldString }) || isCreate)) { // 新增
        return (fieldConfig.create?.render || renderCreateDefault)(log, linkToIssue);
      } if (!updateDontJudge && (updateCondition?.({ newString, oldString }) || isUpdate)) { // 修改
        return (fieldConfig.update?.render || renderUpdateDefault)(log, linkToIssue);
      } if (!deleteDontJudge && (deleteCondition?.({ newString, oldString }) || isDelete)) { // 删除
        return (fieldConfig.delete?.render || renderDeleteDefault)(log, linkToIssue);
      }
      return fieldConfig?.customRender ? fieldConfig?.customRender(log) : '';
    };

    return (
      <>
        {renderLog()}
      </>
    );
  }
  return <></>;
};

export default Log;
