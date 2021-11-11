/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import {
  Modal,
  Tooltip,
} from 'choerodon-ui/pro';
import { get } from 'lodash';
import Action from '@/components/action';
import { getRandomBackground } from '@/utils';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import AddQuickLink from './AddQuickLink';
import { useWorkBenchStore } from '../../stores';
import { useQuickLinkStore } from './stores';
import EmptyImg from './image/empty.svg';
import './index.less';

const QuickLink = observer(() => {
  const {
    AppState,
    AppState: { getUserInfo },
    quickLinkUseStore,
    quickLinkDs,
    addLinkDs,
  } = useQuickLinkStore();

  const {
    workBenchUseStore,
    selectedProjectId,
  } = useWorkBenchStore();

  const {
    type,
    setType,
    listHasMore,
  } = quickLinkUseStore;

  const handleRefresh = async () => {
    quickLinkDs.setQueryParameter('forceUpdate', true);
    await quickLinkDs.query();
  };

  const handleAdd = (data) => {
    Modal.open({
      key: Modal.key(),
      title: data ? '修改链接' : '添加链接',
      style: {
        width: 380,
      },
      children: (
        <AddQuickLink
          type={type}
          AppState={AppState}
          data={data}
          useStore={quickLinkUseStore}
          workBenchUseStore={workBenchUseStore}
          handleRefresh={handleRefresh}
          addLinkDs={addLinkDs}
        />
      ),
      drawer: true,
      okText: data ? '修改' : '添加',
    });
  };

  const handleTopIf = (data) => {
    quickLinkUseStore.axiosTopIf(data).then(() => {
      handleRefresh();
    });
  };

  const handelDelete = async (l) => {
    await quickLinkUseStore.axiosDeleteQuickLink(
      l.id,
      selectedProjectId,
      type,
    );
    handleRefresh();
  };

  const handelOpenDelete = (l) => {
    Modal.confirm({
      okText: '删除',
      title: '删除快速链接',
      children: '确认删除快速链接吗?',
      type: 'warning',
      onOk: () => handelDelete(l),
    });
  };

  const renderActions = (l) => {
    const { realName } = getUserInfo || {};
    const user = get(l, 'user');
    const linkName = get(user, 'realName');
    const editFlag = get(l, 'editFlag');

    const setTop = [
      {
        service: [],
        text: l.top ? '取消置顶' : '置顶',
        action: () => handleTopIf(l),
      },
    ];

    const alter = [
      {
        text: '修改',
        action: () => {
          handleAdd(l);
        },
      },
      {
        text: '删除',
        action: () => handelOpenDelete(l),
      },
    ];

    if (editFlag) {
      return (
        <Action
          data={setTop.concat(alter)}
        />
      );
    }
    return (
      <Action
        data={setTop}
      />
    );
  };

  const renderLinks = () => quickLinkDs.toData().map((l, index) => {
    const user = get(l, 'user');
    // const lastUpdateDate = get(l, 'lastUpdateDate');
    const projectName = get(l, 'projectName');
    const scope = get(l, 'scope');
    const top = get(l, 'top');

    const realName = get(user, 'realName');
    const loginName = get(user, 'loginName');

    const imageUrl = get(user, 'imageUrl');
    const email = get(user, 'email');
    const ldap = get(user, 'ldap');
    // const id = get(user, 'id');
    return (
      (
        <div className="c7n-quickLink-linkItem">
          <div className="c7n-quickLink-linkItem-right">
            <div className="c7n-quickLink-linkItem-circle" />
            <Tooltip title={ldap ? `${realName}(${loginName})` : `${realName}(${email})`}>
              <div
                className="c7n-quickLink-linkItem-right-profile"
                style={{
                  backgroundImage: imageUrl
                    ? `url(${imageUrl})`
                    : getRandomBackground(index),
                }}
              >
                {!imageUrl && realName && realName.slice(0, 1)}
              </div>
            </Tooltip>
            <div className="c7n-quickLink-linkItem-right-content">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={projectName}>
                  <p className="c7n-quickLink-linkItem-right-content-scope">
                    {scope === 'project' ? projectName : '仅自己可见'}
                  </p>
                </Tooltip>
                <span
                  className="c7n-quickLink-linkItem-right-content-top"
                  style={{ display: top ? 'block' : 'none' }}
                >
                  置顶
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Tooltip placement="top" title={l.name}>
                  <p className="c7n-quickLink-linkItem-right-content-name">
                    {l.name}
                  </p>
                </Tooltip>
                <Tooltip placement="top" title={l.linkUrl}>
                  <p
                    onClick={() => window.open(l.linkUrl)}
                    className="c7n-quickLink-linkItem-right-content-linkName"
                    role="none"
                  >
                    <Icon style={{ color: '#5266D4' }} type="link2" />
                    <span>{l.linkUrl}</span>
                  </p>
                </Tooltip>
              </div>
            </div>
            <div
              style={{
                display: l.editFlag ? 'block' : 'none',
                flex: '0 0 0.24rem',
              }}
            >
              {
                renderActions(l)
              }
            </div>
          </div>
        </div>
      )
    );
  });

  const handleLoadMore = () => {
    quickLinkDs.query(quickLinkDs.currentPage + 1);
  };

  const handleChangeType = useCallback((tempType) => setType(tempType), [setType]);

  const renderClassification = useCallback(() => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="c7ncd-classification">
        <span
          onClick={() => handleChangeType('project')}
          className={type === 'project' && 'c7ncd-classification-checked'}
          role="none"
        >
          项目
        </span>
        <i />
        <span
          onClick={() => handleChangeType('self')}
          className={type === 'self' && 'c7ncd-classification-checked'}
          role="none"
        >
          个人
        </span>
      </div>
      <Icon
        style={{ marginLeft: 20 }}
        onClick={() => handleAdd()}
        type="playlist_add"
      />
    </div>
  ), [handleAdd, handleChangeType, type]);

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        {renderClassification()}
      </div>
      <div className="c7n-quickLink-scroll">
        {quickLinkDs.length > 0 ? (
          [
            renderLinks(),
            listHasMore && (
              <a
                onClick={handleLoadMore}
                role="none"
              >
                加载更多
              </a>
            ),
          ]
        ) : (
          <EmptyPage title="暂无快速链接" describe="暂无快速链接，请创建" img={EmptyImg} />
        )}
      </div>
    </div>
  );
});

export default QuickLink;
