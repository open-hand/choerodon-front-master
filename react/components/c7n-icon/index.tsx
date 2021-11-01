import React from 'react';
import classNames from 'classnames';

export interface IconProps extends HTMLElement {
  type: string;
}

/**
 *这个组件要删掉了，用到的地方直接改成components里头的
 *
 * @param {IconProps} props
 * @return {*}
 */
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
