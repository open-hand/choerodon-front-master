import React from 'react';
import ExternalComponent from '@/components/external-component';

const HASBASEPRO = C7NHasModule('@choerodon/base-pro');

const QuestionBtn = () => {
  if (HASBASEPRO) {
    return (
      <div className="c7ncd-header-right-lists-item">
        <ExternalComponent system={{ scope: 'basePro', module: 'base-pro:headQuestionBtn' }} />
      </div>
    );
  }
  return null;
};

export default QuestionBtn;
