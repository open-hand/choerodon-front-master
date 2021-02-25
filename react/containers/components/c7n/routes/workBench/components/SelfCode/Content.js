import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './index.less';
import UserInfo from '@/containers/components/c7n/components/user-info';
import TimePopover from '@/containers/components/c7n/components/time-popover';
import { Tooltip } from 'choerodon-ui/pro';
import ScrollContext from 'react-infinite-scroll-component';
import { Spin } from 'choerodon-ui';
import { debounce, get } from 'lodash';
import LoadingBar from '../../../../tools/loading-bar';

import { useSelfCodeStore } from './stores';

let resizeObserverCode;

const SelfCode = () => {
  const {
    selfCodeDs,
    prefixCls,
    mainStore,
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
            realName={`${realName}`}
            loginName={ldap ? loginName : email}
            showTooltip
          />
          <span>提交于</span>
          <TimePopover content={commitDate} />
        </footer>
      </div>
    );
  });

  async function loadMore() {
    await selfCodeDs.query(selfCodeDs.currentPage + 1);
  }

  const getContent = () => ((!selfCodeDs || (selfCodeDs.status === 'loading' && !selfCodeDs.length)) ? (
    <LoadingBar display />
  ) : (
    <div className={`${prefixCls}-content`}>
      {!selfCodeDs.length ? (
        <div className="c7n-workbench-empty-span">暂无最近代码提交记录</div>
      ) : null}
      {
        <ScrollContext
          className={`${prefixCls}-scroll`}
          dataLength={selfCodeDs.length}
          next={loadMore}
          hasMore={mainStore.getListHasMore}
          height={770}
        >
          {renderItem()}
        </ScrollContext>
      }
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
