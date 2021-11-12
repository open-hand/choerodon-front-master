import React, {
  FC,
} from 'react';
import { mount, has } from '@choerodon/inject';

import './index.less';

export type ExtraButtonProps = {

}

const prefixCls = 'c7ncd-extra-button';

const ExtraButton:FC<ExtraButtonProps> = (props) => {
  if (!has('base-saas:saasUpgrade')) {
    return null;
  }
  return (
    <div className={prefixCls}>
      {mount('base-saas:saasUpgrade', {})}
    </div>
  );
};

export default ExtraButton;
