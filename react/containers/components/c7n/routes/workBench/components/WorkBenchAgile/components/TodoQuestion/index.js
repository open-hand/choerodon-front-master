import React, { useState } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import Card from '../../../card';

import './index.less';

const TodoQuestion = observer(() => {
  const [questions, setQuestions] = useState([{
    project: '基础架构管理-区块链中台研发',
    issueType: 'story',
    issueId: 'C7NCD123',
    description: '开发人员在创建CI流水线时，能添加与编辑Npm构建的步骤',
    status: '待处理',
    priority: '中',
  }, {
    project: '基础架构管理-区块链中台研发',
    issueType: 'story',
    issueId: 'C7NCD123',
    description: '开发人员在创建CI流水线时，能添加与编辑Npm构建的步骤',
    status: '待处理',
    priority: '中',
  }]);

  const renderIssues = () => {
    const mapping = {
      story: {
        icon: 'agile_story',
        color: '#00BFA5'
      },
      bug: {
        icon: 'agile_fault',
        color: '#F77A70',
      },
      task: {
        icon: 'agile_task',
        color: '#6887E8'
      },
    };
    return questions.map(q => (
      <div className="c7n-todoQuestion-issueContent-issueItem">
        <p className="c7n-todoQuestion-issueContent-issueItem-project">{q.project}</p>
        <div className="c7n-todoQuestion-issueContent-issueItem-main">
          <Icon
            className="c7n-todoQuestion-issueContent-issueItem-main-icon"
            type={mapping[q.issueType].icon}
            style={{ color: mapping[q.issueType].color }}
          />
          <span className="c7n-todoQuestion-issueContent-issueItem-main-issueId">{q.issueId}</span>
          <span className="c7n-todoQuestion-issueContent-issueItem-main-description">{q.description}</span>
          <span className="c7n-todoQuestion-issueContent-issueItem-main-status">{q.status}</span>
          <span className="c7n-todoQuestion-issueContent-issueItem-main-priority">
            {q.priority}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="c7n-todoQuestion">
      <Card
        title="待办问题"
        showCount
        count={questions.length}
        className="c7n-todoQuestion-issueContent"
      >
        {renderIssues()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
