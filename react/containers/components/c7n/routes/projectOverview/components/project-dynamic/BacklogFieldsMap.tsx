import React from 'react';
import { difference } from 'lodash';
import { ILog } from './components/Logs/Log';

const fieldsMap = [
  ['backlogNum', {
    name: '需求',
    create: {
      operation: '创建',
      hidden: true,
    },
  }],
  [
    'Backlog Project', {
      name: '需求',
      update: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            oldValue, newValue, summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              <span className="c7n-Log-operation">将</span>
              <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span className="c7n-Log-operation">由</span>
              <span className="c7n-Log-value">{`【${oldValue}】`}</span>
              <span className="c7n-Log-operation">转交到</span>
              <span className="c7n-Log-value">{`【${newValue}】`}</span>
            </span>
          );
        },
      },
    },
  ],
  ['Backlog Summary', {
    name: '概要',
  }],
  ['Backlog Assignees', {
    name: '处理人',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <>
            <span>
              <span className="c7n-Log-operation">更新</span>
              <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span className="c7n-Log-operation">的</span>
              <span className="c7n-Log-field">【处理人】</span>
              <span className="c7n-Log-operation">为</span>
              <span className="c7n-Log-value">{`【${newString}】`}</span>
            </span>
          </>
        );
      },
    },
    update: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, oldString, summary, num, issueTypeVO,
        } = log;
        return (
          <>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【处理人】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </>
        );
      },
    },
  }],
  ['Backlog Status', {
    name: '状态',
  }],
  ['Backlog Attachment', {
    name: '附件',
    create: {
      operation: '上传',
      transform: ({ newString }: { newString: string}) => newString.split('@')[1],
    },
    delete: {
      transform: ({ oldString }: {oldString: string }) => oldString.split('@')[1],
    },
  }],
  ['Backlog Comment', {
    name: '评论',
    create: {
      hidden: true,
    },
    update: {
      hidden: true,
    },
    delete: {
      hidden: true,
    },
  }],
  ['Backlog Classification', {
    name: '需求分类',
  }],
  ['Backlog Priority', {
    name: '优先级',
  }],
  ['Backlog Type', {
    name: '需求类型',
  }],
  ['Backlog Description', {
    name: '描述',
    create: {
      hidden: true,
    },
    update: {
      hidden: true,
    },
    delete: {
      hidden: true,
    },
  }],
  ['Issue Link', {
    name: '关联issue',
    create: {
      condition: ({ newString, oldString }: {newString: string, oldString: string}) => difference(newString && newString.split(','), oldString && oldString.split(',')).length > 0,
      transform: ({ newString, oldString }: {newString: string, oldString: string}) => difference(newString && newString.split(','), oldString && oldString.split(',')).join(','),
    },
    update: {
      dontJudge: true,
    },
    delete: {
      condition: ({ newString, oldString }: {newString: string, oldString: string}) => difference(oldString && oldString.split(','), newString && newString.split(',')).length > 0,
      transform: ({ newString, oldString }: {newString: string, oldString: string}) => difference(oldString && oldString.split(','), newString && newString.split(',')).join(','),
    },
  }],
  ['feedback', {
    name: '反馈说明',
    create: {
      hidden: true,
    },
    update: {
      hidden: true,
    },
    delete: {
      hidden: true,
    },
  }],
  ['Estimated Start Time', {
    name: '预计开始时间',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【预计开始时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">【无】</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
    delete: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          oldString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【预计开始时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
  ['Estimated End Time', {
    name: '预计结束时间',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【预计结束时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">【无】</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
    delete: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          oldString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【预计结束时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
  ['Feedback Frequency', {
    name: '需求反馈频率',
    create: {
      render: (log: { newString: any }) => {
        const { newString } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-field">【需求反馈频率】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">【无】</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
    delete: {
      render: (log: { oldString: any }) => {
        const { oldString } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-field">【需求反馈频率】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
  ['actualStartTime', {
    name: '实际开始时间',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【实际开始时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">【无】</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
    delete: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO, oldString,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【实际开始时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
  ['actualEndTime', {
    name: '实际结束时间',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【实际结束时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">【无】</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
    delete: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO, oldString,
        } = log;
        return (
          <span>
            <span className="c7n-Log-operation">将</span>
            <span className="c7n-Log-operation">{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span className="c7n-Log-operation">的</span>
            <span className="c7n-Log-field">【实际结束时间】</span>
            <span className="c7n-Log-operation">由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span className="c7n-Log-operation">改变为</span>
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
];

export default fieldsMap;
