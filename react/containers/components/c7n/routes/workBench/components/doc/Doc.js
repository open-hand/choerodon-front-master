import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Tooltip, Spin } from 'choerodon-ui/pro';
import ScrollContext from 'react-infinite-scroll-component';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import { getRandomBackground } from '@/containers/components/c7n/util';
import TimePopover from '../time-popover';
import EmptyPage from '../empty-page';
import Card from '../card';
import './index.less';
import { useDoc } from './stores';
import { useWorkBenchStore } from '../../stores';

const clsPrefix = 'c7n-workbench-doc';

function Switch({ options: propsOption, children, onChange, defaultValue, checkedValue }) {
  const [value, setValue] = useState(defaultValue);
  const [options, setOptions] = useState(propsOption || []);
  const onClick = (v) => {
    setValue(v);
    if (onChange) {
      onChange(v);
    }
  };
  useEffect(() => {
    if (!Array.isArray(options)) {
      setOptions([]);
    } else if (!options.some(v => v.value)) {
      setOptions(options.map((v, index) => ({ text: v, value: index })));
    }
    propsOption = options;
  }, []);

  return (
    <ul className={`${clsPrefix}-switch`}>
      {options.map((option, index) => (
        <React.Fragment>
          <li
            onClick={(e) => {
              e.preventDefault();
              onClick(option.value);
            }}
            className={value === option.value ? `${clsPrefix}-switch-active` : `${clsPrefix}-switch-active-li`}
          >
            {option.text || option}
          </li>
          <span className="line" />
        </React.Fragment>
      ))}
    </ul>
  );
}
const Doc = ({ history }) => {
  const { docStore } = useDoc();
  const { docDs, selfDoc, setSelfDoc } = useWorkBenchStore();
  // useEffect(() => {
  //   // 防止初次进入时二次加载
  //   if (!docStore.getIsFistLoad) {
  //     docStore.setLoading(true);
  //     docStore.axiosGetDoc(self).then(res => docStore.setLoading(false)).catch(() => docStore.setLoading(false));
  //   }
  // }, [self]);
  useEffect(() => {
    if (docDs.currentPage === 1) {
      const data = docDs.toData()[0];
      docStore.setDocData(data ? data.list : []);
    }
  }, [docDs.length]);

  function renderTitle() {
    return (
      <div className={`${clsPrefix}-title`}>
        <span>文档</span>
        <Switch defaultValue={false} options={[{ value: false, text: '项目' }, { value: true, text: '个人' }]} onChange={setSelfDoc} />
      </div>
    );
  }
  const goKnowledgeLink = ({ baseId, orgFlag, projectId, organizationId, spaceId, baseName, name }) => {
    const url = `/knowledge/${orgFlag ? 'organization' : 'project'}/doc/${baseId}?baseName=${baseName}&id=${orgFlag ? organizationId : projectId}&organizationId=${organizationId}&spaceId=${spaceId}&name=${name}&type=${orgFlag ? 'organization' : 'project'}`;
    history.push(url);
  };
  const renderUserList = (userList, visibleText = false) => map(userList, ({ realName, loginName, email, ldap, imageUrl }) => (
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
    return map(docStore.getDocData, ({ knowledgeBaseName, orgFlag, id, baseId, organizationId, imageUrl, title, projectId, projectName, organizationName, updatedUserList, lastUpdateDate }) => (
      <div className="c7n-workbench-doc-item" onClick={goKnowledgeLink.bind(this, { baseId, orgFlag, organizationId, spaceId: id, baseName: knowledgeBaseName, projectId, name: orgFlag ? organizationName : projectName })}>
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
                  +{updatedUserList.length - 3}
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
          <span className="c7n-workbench-doc-item-time">
            <TimePopover datetime={lastUpdateDate} />
          </span>
        </div>
      </div>
    ));
  }
  const loadMore = async () => {
    // await docStore.axiosGetDoc(self);
    await docDs.nextPage().then(res => {
      docStore.setDocData(docStore.getDocData.concat(res.toData().list));
    });
  };

  return (
    <div
      className={clsPrefix}
    >
      {renderTitle()}
      <Spin spinning={!docDs.length && docDs.currentPage === 1 && docDs.status === 'loading'}>
        <div className="c7n-workbench-doc-content">
          {
            docStore.getDocData.length > 0
              ? (
                <ScrollContext
                  className={`${clsPrefix}-scroll`}
                  dataLength={docStore.getDocData.length}
                  next={loadMore}
                  // hasMore={docStore.getPageInfo.hasNext}
                  hasMore={docDs.currentPage < docDs.totalPage}
                  loader={<Spin className={`${clsPrefix}-scroll-load`} spinning />}
                  height={438}
                  endMessage={(
                    <span style={{ height: docStore.getDocData.length < 5 ? '1.32rem' : 'auto' }} className={`${clsPrefix}-scroll-bottom`}>到底了</span>
                  )}
                >{renderItems()}
                </ScrollContext>
              )
              : (docDs.status !== 'loading' && docDs.currentPage === 1
                && (
                <EmptyPage
                  title="暂无文档信息"
                  describe="暂无最近操作的文档"
                />
                )
              )
          }

        </div>
      </Spin>

    </div>
  );
};

export default withRouter(observer(Doc));
