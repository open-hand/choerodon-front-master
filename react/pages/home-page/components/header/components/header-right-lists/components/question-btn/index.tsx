import React from 'react';
import { mount, get } from '@choerodon/inject';

const QuestionBtn = () => {
  if (get('base-pro:headQuestionBtn')) {
    return (
      <div className="c7ncd-header-right-lists-item">
        {mount('base-pro:headQuestionBtn', {})}
      </div>
    );
  }
  return null;
};

export default QuestionBtn;
