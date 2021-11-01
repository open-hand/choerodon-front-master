import React from 'react';
import { observer } from 'mobx-react-lite';
import { Tooltip, Icon } from 'choerodon-ui';
import { Loading } from '@choerodon/components';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '../card';
import { useTodoStore } from './stores';
import emptyImg from './image/empty.svg';

import './index.less';

const StarTargetPro = observer(() => {
  const {
    auditDs,
    history,
    organizationId,
  } = useTodoStore();

  function linkToDetail(record) {
    const {
      type, projectId, projectName, pipelineRecordId, mergeRequestUrl, pipelineId, devopsPipelineRecordRelId,
    } = record.toData() || {};
    const search = `?id=${projectId}&name=${encodeURIComponent(projectName)}&organizationId=${organizationId}&type=project`;
    switch (type) {
      case 'pipeline':
        history.push(`/devops/deployment-operation${search}&pipelineRecordId=${pipelineRecordId}`);
        break;
      case 'merge_request':
        window.open(mergeRequestUrl);
        break;
      case 'ci_pipeline':
        history.push(`/devops/pipeline-manage${search}&pipelineId=${pipelineId}&pipelineIdRecordId=${devopsPipelineRecordRelId}`);
        break;
      default:
    }
  }

  const renderContent = () => {
    if (!auditDs || auditDs.status === 'loading') {
      return <Loading display />;
    }

    if (!auditDs.length) {
      return (
        <EmptyPage
          title="暂无待审核任务"
          describe="暂无需您审核的任务"
          img={emptyImg}
        />
      );
    }
    return (
      auditDs.map((record) => {
        const {
          projectName, content, imageUrl, type,
        } = record.toData() || {};
        return (
          <div className="c7n-workbench-check-item" key={record.id}>
            <div className="c7n-workbench-check-item-border" />
            <div className="c7n-workbench-check-item-content">
              <div className="c7n-workbench-check-item-project">{projectName}</div>
              <div className="c7n-workbench-check-item-des">
                {type === 'merge_request' ? (
                  <div className="c7n-workbench-check-item-user">
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" className="c7n-workbench-check-item-user-image" />) : (
                        <span className="c7n-workbench-check-item-user-text">
                          {(content || '').toUpperCase().substring(0, 1)}
                        </span>
                    )}
                  </div>
                ) : null}
                <Tooltip title={content} placement="top">
                  <span className="c7n-workbench-check-item-des-text">{content}</span>
                </Tooltip>
              </div>
            </div>
            <div
              role="none"
              className="c7n-workbench-check-item-btn"
              onClick={() => linkToDetail(record)}
            >
              <Icon type="find_in_page" className="c7n-workbench-check-item-btn-icon" />
              <span>详情</span>
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div className="c7n-workbench-todo">
      <Card
        title="待审核"
        showCount
        count={auditDs.length}
        className="c7n-workbench-check"
      >
        {renderContent()}
      </Card>
    </div>
  );
});

export default StarTargetPro;
