import React from 'react';
import { difference } from 'lodash';
import { ILog } from './components/Logs/Log';

const fieldsMap = [
  ['Sprint', {
    name: '冲刺',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            更新
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【冲刺】</span>
            为
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
  }],
  [
    'status', {
      name: '状态',
    },
  ],
  ['Story Points', {
    name: '故事点',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【故事点】</span>
            <span>由</span>
            <span className="c7n-Log-value">【未预估】</span>
            改变为
            <span className="c7n-Log-value">{`【${Number(newString)}】`}</span>
          </span>
        );
      },
    },
    update: {
      transform: ({ oldString, newString }: { oldString?: string, newString?: string }) => {
        if (oldString) {
          return Number(oldString);
        } if (newString) {
          return Number(newString);
        }
        return '';
      },
    },
    delete: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          oldString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【故事点】</span>
            <span>由</span>
            <span className="c7n-Log-value">{`【${Number(oldString)}】`}</span>
            改变为
            <span className="c7n-Log-value">【未预估】</span>
          </span>
        );
      },
    },
  }],
  ['timeestimate', {
    name: '剩余预估时间',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【剩余预估时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">【未预估】</span>
            改变为
            <span className="c7n-Log-value">{`【${Number(newString)}】`}</span>
          </span>
        );
      },
    },
    update: {
      transform: ({ oldString, newString }: { oldString?: string, newString?: string }) => {
        if (oldString) {
          return Number(oldString);
        } if (newString) {
          return Number(newString);
        }
        return '';
      },
    },
    delete: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          oldString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【剩余预估时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">{`【${Number(oldString)}】`}</span>
            改变为
            <span className="c7n-Log-value">【未预估】</span>
          </span>
        );
      },
    },
  }],
  ['summary', {
    name: '问题概要',
  }],
  ['Attachment', {
    name: '附件',
    create: {
      operation: '上传',
      transform: ({ newString }: { newString: string }) => newString.split('@')[1],
    },
    delete: {
      operation: '删除',
      transform: ({ oldString }: { oldString: string }) => oldString.split('@')[1],
    },
  }],
  ['Comment', {
    name: '评论',
    create: {
      hidden: true,
    },
    update: {
      hidden: true,
    },
    delete: {
      operation: '删除',
      hidden: true,
    },
  }],
  ['description', {
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
  ['Epic Name', {
    name: '史诗名称',
  }],
  ['priority', {
    name: '优先级',
  }],
  ['labels', {
    name: '标签',
    create: {
      condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.trim().split(' '), oldString && oldString.trim().split(' ')).length > 0,
      transform: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.trim().split(' '), oldString && oldString.trim().split(' ')).join(','),
    },
    update: {
      dontJudge: true,
    },
    delete: {
      condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(oldString && oldString.trim().split(' '), newString && newString.trim().split(' ')).length > 0,
      transform: ({ newString, oldString }: { newString: string, oldString: string }) => difference(oldString && oldString.trim().split(' '), newString && newString.trim().split(' ')).join(','),
    },
  }],
  ['Epic Link', {
    name: '史诗',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            更新
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【史诗】</span>
            为
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
  }],
  ['assignee', {
    name: '经办人',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, ruleName, summary, num, issueTypeVO,
        } = log;
        return (
          <>
            {
              ruleName && (
                <span>
                  触发
                  <span className="c7n-Log-field">{`【${ruleName}】`}</span>
                  触发器，
                </span>
              )
            }
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【经办人】</span>
              为
              <span className="c7n-Log-value">{`【${newString}】`}</span>
            </span>
          </>
        );
      },
    },
    update: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, oldString, ruleName, summary, num, issueTypeVO,
        } = log;
        return (
          <>
            {
              ruleName && (
                <span>
                  触发
                  <span className="c7n-Log-field">{`【${ruleName}】`}</span>
                  触发器，
                </span>
              )
            }
            <span>将</span>
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【经办人】</span>
            <span>由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            <span>改变为</span>
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </>
        );
      },
    },
  }],
  ['reporter', {
    name: '报告人',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            更新
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【报告人】</span>
            为
            <span className="c7n-Log-value">{`【${newString}】`}</span>
          </span>
        );
      },
    },
  }],
  ['Component', {
    name: '模块',
  }],
  [
    'Version', {
      name: '影响的版本',
    },
  ],
  [
    'Fix Version', {
      name: '修复的版本',
    },
  ],
  [
    'timespent', {
      name: '花费时间',
      create: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【花费时间】</span>
            </span>
          );
        },
      },
      update: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【花费时间】</span>
            </span>
          );
        },
      },
      delete: {
        dontJudge: true,
      },
    },
  ],
  [
    'WorklogId', {
      name: '工作日志',
      create: {
        hidden: true,
      },
      update: {
        dontJudge: true,
      },
      delete: {
        hidden: true,
      },
    },
  ],
  [
    'Rank', {
      name: '排序',
      create: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【排序】</span>
            </span>
          );
        },
      },
      update: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【排序】</span>
            </span>
          );
        },
      },
      delete: {
        dontJudge: true,
      },
    },
  ],
  [
    'issuetype', {
      name: '类型',
      create: {
        dontJudge: true,
      },
      delete: {
        dontJudge: true,
      },
    },
  ],
  [
    'resolution', {
      name: '解决状态',
      create: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【解决状态】</span>
            </span>
          );
        },
      },
      update: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【解决状态】</span>
            </span>
          );
        },
      },
      delete: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【解决状态】</span>
            </span>
          );
        },
      },
    },
  ],
  [
    'Knowledge Relation', {
      name: '知识文档',
      update: {
        dontJudge: true,
      },
    },
  ],
  [
    'Backlog Link', {
      name: '需求',
      create: {
        condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.split(','), oldString && oldString.split(',')).length > 0,
        transform: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.split(','), oldString && oldString.split(',')).join(','),
      },
      update: {
        dontJudge: true,
      },
      delete: {
        condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(oldString && oldString.split(','), newString && newString.split(',')).length > 0,
        transform: ({ newString, oldString }: { newString: string, oldString: string }) => difference(oldString && oldString.split(','), newString && newString.split(',')).join(','),
      },
    },
  ],
  [
    'Feature Link', {
      name: '特性',
    },
  ],
  [
    'Pi', {
      name: 'PI',
      create: {
        render: (log: ILog, linkToIssue: () => void) => {
          const {
            newString, summary, num, issueTypeVO,
          } = log;
          return (
            <span>
              更新
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              <span>的</span>
              <span className="c7n-Log-field">【PI】</span>
              为
              <span className="c7n-Log-value">{`【${newString}】`}</span>
            </span>
          );
        },
      },
    },
  ],
  [
    'SubTeam', {
      name: '负责的子团队',
      create: {
        condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.split(','), oldString && oldString.split(',')).length > 0,
        transform: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.split(','), oldString && oldString.split(',')).join(','),
      },
      update: {
        condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(newString && newString.split(','), oldString && oldString.split(',')).length === 0,
      },
      delete: {
        condition: ({ newString, oldString }: { newString: string, oldString: string }) => difference(oldString && oldString.split(','), newString && newString.split(',')).length > 0,
        transform: ({ newString, oldString }: { newString: string, oldString: string }) => difference(oldString && oldString.split(','), newString && newString.split(',')).join(','),
      },
    },
  ],
  [
    'Epic Child', {
      name: '史诗关联任务',
      update: {
        dontJudge: true,
      },
    },
  ],
  [
    'Feature Child', {
      name: '特性关联任务',
      update: {
        dontJudge: true,
      },
    },
  ],
  [
    'autoUpdate', {
      create: {
        dontJudge: true,
      },
      update: {
        dontJudge: true,
      },
      delete: {
        dontJudge: true,
      },
      customRender: (log: ILog, linkToIssue: () => void) => {
        const {
          newStatus, trigger, removeResolution, resolutionChanged, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            <span>
              变更了
              <span className="c7n-Log-value">{`【${trigger}】`}</span>
              ，使得
              <span>{issueTypeVO?.name}</span>
              <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
              自动流转到
              <span className="c7n-Log-value">{`【${newStatus}】`}</span>
              {
                resolutionChanged && !removeResolution && (
                  <>
                    ，更新
                    <span className="c7n-Log-value">【解决状态】</span>
                  </>
                )
              }
              {
                resolutionChanged && removeResolution && (
                  <>
                    ，移除
                    <span className="c7n-Log-value">【解决状态】</span>
                  </>
                )
              }
            </span>
          </span>
        );
      },
    },
  ],
  ['Estimated Start Time', {
    name: '预计开始时间',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【预计开始时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">【无】</span>
            改变为
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
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【预计开始时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            改变为
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
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【预计结束时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">【无】</span>
            改变为
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
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【预计结束时间】</span>
            <span>由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            改变为
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
  ['Feature Sprint Link', {
    name: '冲刺',
    create: {
      render: (log: ILog, linkToIssue: () => void) => {
        const {
          newString, summary, num, issueTypeVO,
        } = log;
        return (
          <span>
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【冲刺】</span>
            <span>由</span>
            <span className="c7n-Log-value">【无】</span>
            改变为
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
            将
            <span>{issueTypeVO?.name}</span>
            <span className="c7n-Log-issue" role="none" onClick={linkToIssue}>{`【${num} ${summary}】`}</span>
            <span>的</span>
            <span className="c7n-Log-field">【冲刺】</span>
            <span>由</span>
            <span className="c7n-Log-value">{`【${oldString}】`}</span>
            改变为
            <span className="c7n-Log-value">【无】</span>
          </span>
        );
      },
    },
  }],
  ['Project Move', {
    name: '所属项目',
  }],
  ['Static File', {
    name: 'UI&UX文件',
    create: {
      operation: '上传',
      transform: ({ newString }: { newString: string }) => newString.split('@')[1],
    },
    delete: {
      operation: '删除',
      transform: ({ oldString }: { oldString: string }) => oldString.split('@')[1],
    },
  }],
  ['Static File Rel', {
    name: 'UI&UX文件',
    create: {
      operation: '关联',
      transform: ({ newString }: { newString: string }) => newString.split('@')[1],
    },
    delete: {
      operation: '移除',
      transform: ({ oldString }: { oldString: string }) => oldString.split('@')[1],
    },
  }],
];

export default fieldsMap;
