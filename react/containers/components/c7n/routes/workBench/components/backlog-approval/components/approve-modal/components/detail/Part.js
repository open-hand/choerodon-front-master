import React from 'react';
import { observer } from 'mobx-react-lite';
import './Part.less';

const Part = ({
  title, children, ...otherProps
}) => (
  <div className="c7n-part" {...otherProps}>
    <div className="c7n-part-title">
      <span>{title}</span>
    </div>
    <div className="c7n-part-content">
      {
          children
        }
    </div>
  </div>
);

export default observer(Part);
