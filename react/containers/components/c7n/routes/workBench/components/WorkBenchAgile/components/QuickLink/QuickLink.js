import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import Action from '@/containers/components/c7n/tools/action';
import TimePopover from '@/containers/components/c7n/routes/workBench/components/time-popover';
import { Modal, Form, SelectBox, Select, TextField } from 'choerodon-ui/pro';
import AddQuickLink from './AddQuickLink';
import { useWorkBenchStore } from '../../../../stores';
import { useQuickLinkStore } from './stores';
import EmptyPage from '../../../empty-page';

import './index.less';

const QuickLink = observer(() => {
  const {
    AddLinkDataSet,
    quickLinkUseStore,
  } = useQuickLinkStore();

  const {
    workBenchUseStore,
  } = useWorkBenchStore();

  const init = () => {
    let id;
    if (workBenchUseStore.getActiveStarProject) {
      id = workBenchUseStore.getActiveStarProject.id;
    }
    quickLinkUseStore.axiosGetQuickLinkList(id);
  };

  useEffect(() => {
    init();
  }, [workBenchUseStore.getActiveStarProject]);

  const handleAdd = useCallback((data) => {
    Modal.open({
      key: Modal.key(),
      title: data ? '修改链接' : '添加链接',
      style: {
        width: 380,
      },
      children: <AddQuickLink data={data} useStore={quickLinkUseStore} dataSet={AddLinkDataSet} workBenchUseStore={workBenchUseStore} />,
      drawer: true,
      okText: '添加',
    });
  }, [AddLinkDataSet.current.get('scope')]);

  const renderLinks = () => {
    return quickLinkUseStore.getQuickLinkList.map(l => (
      <div className="c7n-quickLink-linkItem">
        <div className="c7n-quickLink-linkItem-left">
          <p className="c7n-quickLink-linkItem-left-name">{l.user.realName}</p>
          <p className="c7n-quickLink-linkItem-left-time">
            <TimePopover datetime={l.creationDate} />
          </p>
        </div>
        <div className="c7n-quickLink-linkItem-circle" />
        <div className="c7n-quickLink-linkItem-right">
          <div
            className="c7n-quickLink-linkItem-right-profile"
            style={{
              backgroundImage: `url(${l.user.imageUrl})`
            }}
          />
          <div className="c7n-quickLink-linkItem-right-content">
            <p className="c7n-quickLink-linkItem-right-content-scope">{l.scope === 'project' ? '项目可见' : '仅自己可见'}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className="c7n-quickLink-linkItem-right-content-name">{l.name}</p>
              <p onClick={() => window.open(l.linkUrl)} className="c7n-quickLink-linkItem-right-content-linkName">
                <Icon style={{ color: '#5266D4' }} type="link2" />
                <span>{l.linkUrl}</span>
              </p>
            </div>
          </div>
          <div
            style={{
              display: l.editFlag ? 'block' : 'none',
            }}
          >
            <Action data={[{
              service: [],
              icon: '',
              text: '修改',
              action: () => {
                handleAdd(l)
              }
            }, {
              service: [],
              icon: '',
              text: '删除',
              action: () => {
                Modal.confirm({
                  okText: '删除',
                  title: '删除快速链接',
                  children: '确认删除快速链接吗?',
                  type: 'warning',
                  onOk() {
                    quickLinkUseStore.axiosDeleteQuickLink(l.id);
                  },
                });
              }
            }]} />
          </div>
        </div>
      </div>
    ))
  }

  const handleLoadMore = () => {
    const originSize = quickLinkUseStore.getParams.size;
    quickLinkUseStore.setParams({
      size: originSize + 10,
      hasMore: false,
    });
    init();
  }

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        <Icon onClick={() => handleAdd()} type="playlist_add" />
      </div>
      <div className="c7n-quickLink-scroll">
        {
          quickLinkUseStore.getQuickLinkList.length > 0 ? [
            renderLinks(),
            quickLinkUseStore.getParams.hasMore && <a onClick={() => handleLoadMore()}>加载更多</a>
          ] : (
            <EmptyPage
              title="暂无快速链接"
              describe="暂无快速链接，请创建"
            />
          )
        }
      </div>
    </div>
  );
});

export default QuickLink;
