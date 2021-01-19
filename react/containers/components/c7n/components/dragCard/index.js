import { Icon } from 'choerodon-ui';
import { get } from 'lodash';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import React from 'react';

import './index.less';

const prefixCls = 'c7ncd-dragCard';

const DragCard = (props) => {
  const {
    children,
    className,
    onDelete,
    isEdit,
    record,
    isStatic,
    ...rest
  } = props;

  const getClassName = classnames({
    [prefixCls]: true,
    [className]: true,
    [`${prefixCls}-isEdit`]: isEdit,
    [`${prefixCls}-static`]: isStatic,
  });

  return (
    <div
      {...rest}
      className={getClassName}
    >
      {
       isEdit && onDelete && typeof onDelete === 'function' ? (
         <Icon
           role="none"
           type="delete_forever"
           className={`${prefixCls}-icon ${prefixCls}-delete`}
           onClick={() => onDelete(record)}
         />
       ) : ''
      }
      {isEdit && (
      <Icon
        type="baseline-drag_indicator"
        className={`${prefixCls}-icon ${prefixCls}-drag`}
      />
      )}

      <div className={`${prefixCls}-container`}>
        {children}
      </div>
    </div>
  );
};

export default observer(DragCard);
