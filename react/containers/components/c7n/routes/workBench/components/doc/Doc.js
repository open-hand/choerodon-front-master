import React, { useEffect } from 'react';
import map from 'lodash/map';
import { observer } from 'mobx-react-lite';
import { Tooltip, Spin } from 'choerodon-ui/pro';
import ScrollContext from 'react-infinite-scroll-component';
import { getRandomBackground } from '@/containers/components/c7n/util';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import TimePopover from '../time-popover';
import Switch from './components/SwitchTabs';
import EmptyImg from './image/empty.svg';
import './index.less';
import { useDoc } from './stores';

const Doc = () => {
  const {
    docStore,
    docDs,
    history,
    clsPrefix,
  } = useDoc();

  const {
    getListHasMore,
    rowNumber,
  } = docStore;

  const renderTitle = () => (
    <div className={`${clsPrefix}-title`}>
      <span>文档</span>
      <Switch />
    </div>
  );

  const goKnowledgeLink = ({
    baseId, orgFlag, projectId, organizationId, spaceId, baseName, name,
  }) => {
    const url = `/knowledge/${orgFlag ? 'organization' : 'project'}/doc/${baseId}?baseName=${baseName}&id=${orgFlag ? organizationId : projectId}&organizationId=${organizationId}&spaceId=${spaceId}&name=${name}&type=${orgFlag ? 'organization' : 'project'}`;
    history.push(url);
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

  function renderItems() {
    return map(docDs.toData(), ({
      knowledgeBaseName, orgFlag, id, baseId, organizationId, imageUrl, title, projectId, projectName, organizationName, updatedUserList: originUpdatedUserList, lastUpdateDate,
    }) => {
      const updatedUserList = originUpdatedUserList ? originUpdatedUserList.filter(Boolean) : [];
      return (
        <div
          role="none"
          className="c7n-workbench-doc-item"
          onClick={goKnowledgeLink.bind(this, {
            baseId, orgFlag, organizationId, spaceId: id, baseName: knowledgeBaseName, projectId, name: orgFlag ? organizationName : projectName,
          })}
        >
          <div className="c7n-workbench-doc-item-info">
            <span className="c7n-workbench-doc-item-logo c7n-workbench-doc-item-logo-update">
              {`${title}`.toUpperCase().substring(0, 1)}
            </span>
            <div className="c7n-workbench-doc-item-userlist">
              {renderUserList(updatedUserList.slice(0, 3))}

              {updatedUserList.length > 3 && (
                <Tooltip
                  placement="top"
                  title={renderUserList(updatedUserList.slice(3), true)}
                >
                  <span className="c7n-workbench-doc-item-userlist-user-item c7n-workbench-doc-item-userlist-user-item-more">
                    +
                    {updatedUserList.length - 3}
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
          <div className={`${clsPrefix}-item-project`}>
            {!orgFlag && (
              <div className={`${clsPrefix}-item-project-logo`}>
                <Tooltip placement="top" title={`所属项目：${projectName}`}><div style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : getRandomBackground(organizationId || projectId + 1) }}>{imageUrl ? '' : String(projectName || organizationName)[0].toUpperCase()}</div></Tooltip>
              </div>
            )}
            <Tooltip placement="top" title={knowledgeBaseName}><span className={`${clsPrefix}-item-project-text ${!orgFlag ? `${clsPrefix}-item-project-text-dot` : ''}`}>{knowledgeBaseName}</span></Tooltip>
            {orgFlag && <span className="c7n-workbench-doc-item-org">组织</span>}
          </div>
          <div className="c7n-workbench-doc-item-title">
            <Tooltip title={title}>
              <span className="c7n-workbench-doc-item-title-text">{title}</span>
            </Tooltip>
            <span className="c7n-workbench-doc-item-title-time">
              <TimePopover datetime={lastUpdateDate} />
            </span>
          </div>
        </div>
      );
    });
  }

  const loadMore = async () => {
    await docDs.query(docDs.currentPage + 1);
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
                  height={((rowNumber - 1) * 150) + 120}
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
                    title="暂无文档信息"
                    describe="暂无最近操作的文档"
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
