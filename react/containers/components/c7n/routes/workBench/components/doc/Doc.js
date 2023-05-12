import React, { useEffect } from 'react';
import map from 'lodash/map';
import { observer } from 'mobx-react-lite';
import { Tooltip, Spin, message } from 'choerodon-ui/pro';
import ScrollContext from 'react-infinite-scroll-component';
import moment from 'moment';
import { get as injectGet } from '@choerodon/inject';
import { TimePopover } from '@zknow/components';
import { getRandomBackground } from '@/utils';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import { linkTo } from '@/utils/to';
import Switch from './components/SwitchTabs';
import EmptyImg from './image/empty.svg';
import './index.less';
import { useDoc } from './stores';
import { useWorkBenchStore } from '../../stores';

const Doc = () => {
  const {
    formatWorkbench,
  } = useWorkBenchStore();
  const {
    docStore,
    docDs,
    clsPrefix,
  } = useDoc();

  const {
    getListHasMore,
  } = docStore;

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>{formatWorkbench({ id: 'document' })}</span>
      <Switch />
    </div>
  );

  const goKnowledgeLink = ({
    baseId, orgFlag, projectId, organizationId, spaceId, baseName, name, approve,
  }) => {
    if (!approve) {
      message.info('暂无查看权限');
      return;
    }
    // 敏捷跳转方法 知识库有部分内容依赖敏捷内容，故若无敏捷内的方法，则说明敏捷基础服务未安装 ，则不进行跳转
    linkTo(`/knowledge/${orgFlag ? 'organization' : 'project'}/doc/${baseId}`, {
      type: orgFlag ? 'org' : 'project',
      id: orgFlag ? organizationId : projectId,
      params: {
        baseName,
        spaceId,
      },
    }, { blank: true });
  };

  const renderUserList = (userList, visibleText = false) => map(userList, ({
    realName, loginName, email, ldap, imageUrl,
  }) => (
    <Tooltip
      placement="top"
      title={ldap ? `${realName}(${loginName})` : `${realName}(${email})`}
    >
      <div className={`c7n-workbench-doc-item-userlist-user${visibleText ? ' c7n-workbench-doc-item-userlist-user-list' : ''}`}>
        {imageUrl ? (
          <img
            className={`c7n-workbench-doc-item-userlist-user-${visibleText ? 'avatar' : 'item'}`}
            src={imageUrl}
            alt=""
          />
        ) : (
          <span className={`c7n-workbench-doc-item-userlist-user-${visibleText ? 'avatar' : 'item'}`}>
            {(realName || '').substring(0, 1).toUpperCase()}
          </span>
        )}
        {visibleText && <span className="c7n-workbench-doc-item-userlist-user-name">{realName}</span>}
      </div>
    </Tooltip>
  ));

  const getProjectAvatar = (projectVO) => {
    const { name: projectName, imageUrl, creationDate } = projectVO || {};
    const unix = String(moment(creationDate).unix());
    return (
      <div
        className={`${clsPrefix}-project-avatar`}
        style={{
          backgroundImage: imageUrl
            ? `url("${imageUrl}")`
            : getRandomBackground(unix.substring(unix.length - 3)),
        }}
      >
        {!imageUrl && projectName && projectName.slice(0, 1)}
      </div>
    );
  };

  function renderItems() {
    return map(docDs.toData(), ({
      knowledgeBaseName, orgFlag, id, baseId, organizationId, imageUrl, title, projectId, projectName, organizationName,
      updatedUserList: originUpdatedUserList, lastUpdateDate, approve,
    }) => {
      const updatedUserList = originUpdatedUserList ? originUpdatedUserList.filter(Boolean) : [];
      return (
        <div
          role="none"
          className={`${clsPrefix}-item`}
          onClick={goKnowledgeLink.bind(this, {
            baseId, orgFlag, organizationId, spaceId: id, baseName: knowledgeBaseName, projectId, name: orgFlag ? organizationName : projectName, approve,
          })}
        >
          {orgFlag ? (
            <Tooltip title={`所属组织：${organizationName}`}>
              {getProjectAvatar({ name: organizationName, creationDate: organizationId })}
            </Tooltip>
          ) : (
            <Tooltip title={`所属项目：${projectName}`}>
              {getProjectAvatar({ name: projectName, imageUrl, creationDate: projectId })}
            </Tooltip>
          )}
          <div className={`${clsPrefix}-item-right`}>
            <div className={`${clsPrefix}-item-title`}>
              <Tooltip title={title}>
                <span className={`${clsPrefix}-item-title-text`}>{title}</span>
              </Tooltip>
              <div className={`${clsPrefix}-item-title-wrap`}>
                <Tooltip title={knowledgeBaseName}>
                  <span className={`${clsPrefix}-item-title-text`}>{knowledgeBaseName}</span>
                </Tooltip>
                {orgFlag && <span className={`${clsPrefix}-item-org`}>组织</span>}
              </div>
            </div>
            <div className={`${clsPrefix}-item-info`}>
              <div className={`${clsPrefix}-item-userlist`}>
                {renderUserList(updatedUserList.slice(0, 3))}

                {updatedUserList.length > 3 && (
                  <Tooltip
                    placement="top"
                    title={renderUserList(updatedUserList.slice(3), true)}
                  >
                    <span className={`${clsPrefix}-item-userlist-user-item ${clsPrefix}-item-userlist-user-item-more`}>
                      +
                      {updatedUserList.length - 3}
                    </span>
                  </Tooltip>
                )}
              </div>
              <div className={`${clsPrefix}-item-info-time`}>
                <span>最近更新：</span>
                <TimePopover content={lastUpdateDate} />
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  const loadMore = async () => {
    await docDs.queryMore(docDs.currentPage + 1);
  };

  return (
    <div
      className={clsPrefix}
    >
      {renderTitle()}
      <Spin spinning={docDs.status === 'loading'}>
        <div className="c7n-workbench-doc-content">
          {
            docDs.length > 0
              ? (
                <ScrollContext
                  className={`${clsPrefix}-scroll`}
                  dataLength={docDs.length}
                  next={loadMore}
                  hasMore={getListHasMore}
                  height="100%"
                  endMessage={(
                    <span
                      style={{ height: docDs.length < 5 ? '1.32rem' : 'auto' }}
                      className={`${clsPrefix}-scroll-bottom`}
                    >
                      {getListHasMore ? '到底了' : ''}
                    </span>
                  )}
                >
                  {renderItems()}
                </ScrollContext>
              )
              : (docDs.status !== 'loading' && docDs.currentPage === 1
                && (
                  <EmptyPage
                    title={formatWorkbench({ id: 'noDoc' })}
                    describe={formatWorkbench({ id: 'noDocOpts' })}
                    img={EmptyImg}
                  />
                )
              )
          }
        </div>
      </Spin>
    </div>
  );
};

export default observer(Doc);
