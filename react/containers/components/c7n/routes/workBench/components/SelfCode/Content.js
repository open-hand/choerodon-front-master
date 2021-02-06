import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './index.less';
import UserInfo from '@/containers/components/c7n/components/user-info';
import TimePopover from '@/containers/components/c7n/components/time-popover';
import { Tooltip } from 'choerodon-ui/pro';
import LoadingBar from '../../../../tools/loading-bar';
import { useSelfCodeStore } from './stores';

const SelfCode = () => {
  const {
    selfCodeDs,
    prefixCls,
  } = useSelfCodeStore();

  const renderItem = () => selfCodeDs.map((record) => {
    const {
      imgUrl,
      commitDate,
      commitContent,
      appServiceName,
      appServiceCode,
      ldap,
      realName,
      email,
      loginName,
      url,
    } = record.toData();

    function linkto() {
      window.open(url);
    }

    return (
      <div className={`${prefixCls}-item`}>
        <Tooltip title={commitContent} placement="topLeft">
          <header onClick={linkto} role="none">
            {commitContent}
          </header>
        </Tooltip>
        <main>
          <span>
            应用服务：
          </span>
          <span>
            {appServiceName}
            {appServiceCode && (appServiceCode)}
          </span>
        </main>
        <footer>
          <UserInfo
            avatar={imgUrl}
            realName={`${realName}(${ldap ? loginName : email})`}
            loginName={ldap ? loginName : email}
            showTooltip
          />
          <span>提交于</span>
          <TimePopover content={commitDate} />
        </footer>
      </div>
    );
  });

  const getContent = () => ((!selfCodeDs || selfCodeDs.status === 'loading') ? (
    <LoadingBar display />
  ) : (
    <div className={`${prefixCls}-content`}>
      {!selfCodeDs.length ? (
        <div className="c7n-workbench-empty-span">暂无最近代码提交记录</div>
      ) : null}
      {renderItem()}
    </div>
  ));

  return (
    <div className={`${prefixCls}`}>
      <div className={`${prefixCls}-title`}>
        <span>代码提交记录</span>
      </div>
      {getContent()}
    </div>
  );
};

export default observer(SelfCode);
