import React, { memo, useMemo } from 'react';

import './index.less';

interface QuestionCountProps {
  count: number;
  // eslint-disable-next-line react/require-default-props
  className?: string,
}

const QuestionCount = memo(({ count = 0, className = '' }: QuestionCountProps) => {
  const prefixCls = useMemo(() => 'c7ncd-workbench-question-title-count', []);
  return (
    <span className={`${prefixCls} ${className}`}>
      {count}
    </span>
  );
});

export default QuestionCount;
