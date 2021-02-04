import React from 'react';
import classNames from 'classnames';

export interface IconProps extends HTMLElement {
  type: string;
}

const C7NIcon = function Icon(props: IconProps) {
  const {
    type, className = '', ...otherProps
  } = props;
  const classString = classNames('icon', 'c7n-icon', `icon-${type}`, className);
  // @ts-ignore
  return <i {...otherProps} className={classString} />;
};

C7NIcon.displayName = 'C7NIcon';

export default C7NIcon;
