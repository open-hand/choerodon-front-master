import React, {
  memo, FC, useMemo,
} from 'react';
import { Tooltip } from 'choerodon-ui';

import './index.less';

interface Props {
  realName: string,
  avatar?: string | null | undefined,
  size?: string,
  loginName?: string,
  showName?: boolean,
  showTooltip?: boolean,
  className?: string,
}

const UserInfo: FC<Props> = memo(({
  realName, showName = true, size = 'small', avatar, loginName, showTooltip = true, className,
}) => {
  const ava = useMemo(() => {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt="avatar"
          className={`c7ncd-test-user-info-wrap-avatar c7ncd-test-user-info-wrap-avatar-${size}`}
        />
      );
    }
    return (
      <span className={`c7ncd-test-user-info-wrap-avatar-txt c7ncd-test-user-info-wrap-avatar-${size}`}>
        {(realName || '').toUpperCase().substring(0, 1)}
      </span>
    );
  }, [avatar, size, realName]);

  return (
    <div className={`c7ncd-test-user-info-wrap ${className || ''}`}>
      <Tooltip title={showTooltip ? `${realName}${loginName ? ` (${loginName})` : ''}` : ''}>
        {ava}
      </Tooltip>
      {showName ? (
        <div className="c7ncd-test-user-info-wrap-name">
          {realName}
        </div>
      ) : null}
    </div>
  );
});

export default UserInfo;
