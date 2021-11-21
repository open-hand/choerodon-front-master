import React, {
  useEffect,
} from 'react';
import { mount, get } from '@choerodon/inject';

let ele:any = null;

const QuestionBtn = () => {
  useEffect(() => {
    if (get('base-pro:headQuestionBtn')) {
      ele = (
        <>
          {mount('base-pro:headQuestionBtn', {})}
        </>
      );
    }
  }, []);

  return ele;
};

export default QuestionBtn;
