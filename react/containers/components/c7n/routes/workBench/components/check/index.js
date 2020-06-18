import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui/pro';
import { useWorkBenchStore } from '../../stores';
import LoadingBar from '../../../../tools/loading-bar';

import './index.less';

const StarTargetPro = observer(() => {
  const {
    auditDs,
    history,
    AppState: { currentMenuType: { organizationId, name } },
  } = useWorkBenchStore();

  function linkToDetail(record) {
    const { type, projectId, projectName, pipelineRecordId, mergeRequestUrl } = record.toData() || {};
    if (type === 'pipeline') {
      const search = `?id=${projectId}&name=${projectName}&organizationId=${organizationId}&type=project`;
      history.push(`/devops/deployment-operation${search}&pipelineRecordId=${pipelineRecordId}`);
    } else if (type === 'merge_request') {
      window.open(mergeRequestUrl);
    }
  }

  if (!auditDs || auditDs.status === 'loading') {
    return <LoadingBar display />;
  }

  return (auditDs.map((record) => {
    const { projectName, content, imageUrl, type } = record.toData() || {};
    return (
      <div className="c7n-workbench-check-item" key={record.id}>
        <div className="c7n-workbench-check-item-border" />
        <div className="c7n-workbench-check-item-content">
          <div className="c7n-workbench-check-item-project">{projectName}</div>
          <div className="c7n-workbench-check-item-des">
            {type === 'merge_request' ? (
              <div className="c7n-workbench-check-item-user">
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" />) : (
                    <span className="c7n-workbench-check-item-user-text">
                      {(content || '').toUpperCase().substring(0, 1)}
                    </span>
                )}
              </div>
            ) : null}
            <span className="c7n-workbench-check-item-des-text">{content}</span>
          </div>
        </div>
        <div className="c7n-workbench-check-item-btn" onClick={() => linkToDetail(record)}>
          <Icon type="find_in_page" className="c7n-workbench-check-item-btn-icon" />
          <span>详情</span>
        </div>
      </div>
    );
  }));
});

export default StarTargetPro;
