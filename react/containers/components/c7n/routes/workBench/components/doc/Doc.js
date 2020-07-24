import React, { useEffect, useState } from 'react';
import map from 'lodash/map';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Tooltip } from 'choerodon-ui/pro';
import TimePopover from '../time-popover';
import EmptyPage from '../empty-page';
import Card from '../card';
import './index.less';
import { useDoc } from './stores';

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
  const [self, setSelf] = useState(false);
  useEffect(() => {
    docStore.axiosGetDoc(self);
  }, [self]);
  function renderTitle() {
    return (
      <div className={`${clsPrefix}-title`}>
        <span>文档</span>
        <Switch defaultValue={false} options={[{ value: false, text: '项目' }, { value: true, text: '个人' }]} onChange={setSelf} />
      </div>
    );
  }
  const goKnowledgeLink = ({ id, projectId, organizationId, spaceId, baseName }) => {
    const url = `/knowledge/project/doc/${id}?baseName=${baseName}&id=${projectId}&organizationId=${organizationId}&spaceId=${spaceId}&type=project`;
    history.push(url);
  };
  const renderUserList = (userList) => map(userList, ({ realName, imageUrl }) => (
    <Tooltip
      placement="top"
      title={realName}
    >
      {imageUrl ? (
        <img
          className="c7n-workbench-doc-item-userlist-item"
          src={imageUrl}
          alt=""
        />
      ) : (
        <span className="c7n-workbench-doc-item-userlist-item">
          {(realName || '').substring(0, 1).toUpperCase()}
        </span>
      )}
    </Tooltip>
  ));
  return (
    <div
      className={clsPrefix}
    >
      {renderTitle()}
      <div className="c7n-workbench-doc-content">

        {
          docStore.getDocData.length > 0 ? map(docStore.getDocData, ({ knowledgeBaseName, id, organizationId, imageUrl, pageId, title, projectId, updatedUserList, lastUpdateDate, type, orgName }) => (
            <div className="c7n-workbench-doc-item" onClick={goKnowledgeLink.bind(this, { id, organizationId, spaceId: pageId, baseName: knowledgeBaseName, projectId })}>
              <div className="c7n-workbench-doc-item-info">
                <span className="c7n-workbench-doc-item-logo c7n-workbench-doc-item-logo-create">
                  {title.toUpperCase().substring(0, 1)}
                </span>
                <div className="c7n-workbench-doc-item-userlist">
                  {renderUserList(updatedUserList.slice(0, 3))}
                  {updatedUserList.length > 3 && (
                    <Tooltip
                      placement="top"
                      title={renderUserList(updatedUserList.slice(3))}
                    >
                      <span className="c7n-workbench-doc-item-userlist-item">
                        +{updatedUserList.length - 3}
                      </span>
                    </Tooltip>
                  )}
                </div>
              </div>
              <div className={`${clsPrefix}-item-project`}>
                <div className={`${clsPrefix}-item-project-logo`}>
                  <div style={{ [`background-${imageUrl ? 'image' : 'color'}`]: imageUrl ? `url(${imageUrl})` : '#6887e8' }}>{imageUrl ? '' : 'C'}</div>
                </div>
                <span className={`${clsPrefix}-item-project-text`}>{knowledgeBaseName}</span>
                {orgName && <span className="c7n-workbench-doc-item-org">组织</span>}
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
          )) : (
            <EmptyPage
              title="暂无文档信息"
              describe="暂无文档相关的记录，请直接前往知识库中查看"
            />
          )
        }

      </div>
    </div>
  );
};

export default withRouter(observer(Doc));
