import React from 'react';
import classNames from 'classnames';
import { C7NBaseIcon } from '@choerodon/components';

export interface IconProps extends HTMLElement {
  type: string;
}

/**

 * @deprecated 废弃 使用 `import { C7NBaseIcon } from '@choerodon/components';` 替代此导入
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
