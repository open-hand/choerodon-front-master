import React from 'react';
import { observer } from 'mobx-react-lite';
import ExternalComponent from '@/components/external-component';
import './index.less';

const QuestionBtn = () => {
  return (
    <div>
      <ExternalComponent system={{ scope: 'baseBusiness', module: 'base-business:ycloudBtn' }} />
    </div>
  );

  return null;
};

export default observer(QuestionBtn);
