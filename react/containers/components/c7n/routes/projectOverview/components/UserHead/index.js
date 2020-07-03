import React, { useState, memo, useEffect } from 'react';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import './index.less';

function getFirst(str) {
  if (!str) {
    return '';
  }
  const re = /[\u4E00-\u9FA5]/g;
  for (let i = 0, len = str.length; i < len; i += 1) {
    if (re.test(str[i])) {
      return str[i];
    }
  }
  return str[0];
}
const UserHead = memo(({
  imageUrl,
  imageSize,
  nameFontSize,
  hiddenName = false,
  hiddenRoleName = false,
  realName = '易易易',
  roles = ['admin', 'admin'],
}) => {
  const [url, setUrl] = useState(0);

  return (
    <div className="c7n-project-overview-user-head">
      <div className="c7n-project-overview-user-head-left" style={{ width: imageSize, height: imageSize }}>
        {
          imageUrl ? (
            <img src={imageUrl} alt="" style={{ width: '100%' }} />
          ) : (
              <span
                className="c7n-project-overview-user-head-title"
              >
                {getFirst(realName)}
              </span>
            )
        }
      </div>
      <div className="c7n-project-overview-user-head-right">
        {hiddenName ? '' : <span className="c7n-project-overview-user-head-right-name" style={{ fontSize: nameFontSize }}>易烊千玺</span>}
        {hiddenRoleName ? '' : <span className="c7n-project-overview-user-head-right-role-name">项目所有者、项目成员</span>}
      </div>

    </div>

  );
});

export default UserHead;
