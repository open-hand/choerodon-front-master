import React from 'react';
import ExternalComponent from '@/components/external-component';

const QuestionBtn = () => {
  if (window.basePro) {
    return (
      <div className="c7ncd-header-right-lists-item">
        <ExternalComponent system={{ scope: 'basePro', module: 'base-pro:headQuestionBtn' }} />
      </div>
    );
  }
  return null;
};

export default QuestionBtn;
