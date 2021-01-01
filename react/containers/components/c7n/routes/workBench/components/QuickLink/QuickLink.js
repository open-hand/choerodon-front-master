/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState, useEffect,
} from 'react';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import Action from '@/containers/components/c7n/tools/action';
import TimePopover from '@/containers/components/c7n/routes/workBench/components/time-popover';
import {
  Modal,
  Tooltip,
} from 'choerodon-ui/pro';
import { getRandomBackground } from '@/containers/components/c7n/util';
import AddQuickLink from './AddQuickLink';
import { useWorkBenchStore } from '../../stores';
import { useQuickLinkStore } from './stores';
import EmptyPage from '../empty-page';
import EmptyImg from './image/empty.svg';
import './index.less';

const QuickLink = observer(() => {
  const {
    AppState,
    quickLinkUseStore,
    AppState: {
      currentMenuType: { organizationId },
    },
  } = useQuickLinkStore();

  const { workBenchUseStore } = useWorkBenchStore();

  const [type, setType] = useState('project');
  const [activeId, setActiveId] = useState(undefined);

  const init = () => {
    let id;
    if (workBenchUseStore.getActiveStarProject) {
      id = workBenchUseStore.getActiveStarProject.id;
      setActiveId(activeId);
    }
    quickLinkUseStore.axiosGetQuickLinkList(id, type);
  };

  useEffect(() => {
    init();
  }, [workBenchUseStore.getActiveStarProject, organizationId, type]);

  const handleAdd = (data) => {
    Modal.open({
      key: Modal.key(),
      title: data ? '修改链接' : '添加链接',
      style: {
        width: 380,
      },
      children: (
        <AddQuickLink
          activeId={activeId}
          type={type}
          AppState={AppState}
          data={data}
          useStore={quickLinkUseStore}
          workBenchUseStore={workBenchUseStore}
        />
      ),
      drawer: true,
      okText: '添加',
    });
  };

  const handleTopIf = (data) => {
    quickLinkUseStore.axiosTopIf(data).then(() => {
      init();
    });
  };

  const renderLinks = () => quickLinkUseStore.getQuickLinkList.map((l, index) => (
    <div className="c7n-quickLink-linkItem">
      <div className="c7n-quickLink-linkItem-left">
        <p className="c7n-quickLink-linkItem-left-name">
          <Tooltip title={l.user.realName} placement="top">
            {l.user.realName}
          </Tooltip>
        </p>
        <p className="c7n-quickLink-linkItem-left-time">
          <TimePopover datetime={l.lastUpdateDate} />
        </p>
      </div>
      <div className="c7n-quickLink-linkItem-right">
        <div className="c7n-quickLink-linkItem-circle" />
        <div
          className="c7n-quickLink-linkItem-right-profile"
          style={{
            backgroundImage: l.user.imageUrl
              ? `url(${l.user.imageUrl})`
              : getRandomBackground(index),
          }}
        >
          {!l.user.imageUrl && l.user.realName && l.user.realName.slice(0, 1)}
        </div>
        <div className="c7n-quickLink-linkItem-right-content">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={l?.projectName}>
              <p className="c7n-quickLink-linkItem-right-content-scope">
                {l.scope === 'project' ? l.projectName : '仅自己可见'}
              </p>
            </Tooltip>
            <span
              className="c7n-quickLink-linkItem-right-content-top"
              style={{ display: l.top ? 'block' : 'none' }}
            >
              置顶
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
          }}
        >
          <Action
            data={[
              {
                service: [],
                icon: '',
                text: l.top ? '取消置顶' : '置顶',
                action: () => handleTopIf(l),
              },
              {
                service: [],
                icon: '',
                text: '修改',
                action: () => {
                  handleAdd(l);
                },
              },
              {
                service: [],
                icon: '',
                text: '删除',
                action: () => {
                  Modal.confirm({
                    okText: '删除',
                    title: '删除快速链接',
                    children: '确认删除快速链接吗?',
                    type: 'warning',
                    okProps: { color: 'red' },
                    cancelProps: { color: 'dark' },
                    onOk() {
                      quickLinkUseStore.axiosDeleteQuickLink(
                        l.id,
                        activeId,
                        type,
                      );
                    },
                  });
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  ));

  const handleLoadMore = () => {
    const originSize = quickLinkUseStore.getParams.size;
    quickLinkUseStore.setParams({
      size: originSize + 10,
      hasMore: false,
    });
    init();
  };

  const handleChangeType = (tempType) => setType(tempType);

  const renderClassification = () => (
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
  );

  return (
    <div className="c7n-quickLink">
      <div className="c7n-quickLink-title">
        快速链接
        {renderClassification()}
      </div>
      <div className="c7n-quickLink-scroll">
        {quickLinkUseStore.getQuickLinkList.length > 0 ? (
          [
            renderLinks(),
            quickLinkUseStore.getParams.hasMore && (
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
