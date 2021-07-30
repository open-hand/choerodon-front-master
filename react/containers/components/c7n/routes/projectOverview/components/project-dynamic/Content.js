import React, { useCallback, useEffect } from 'react';
import {
  Button, Icon, Spin,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { AnimationLoading } from '@choerodon/components';
import EmptyPage from '../EmptyPage';
import OverviewWrap from '../OverviewWrap';
import issueFieldsMap from './IssueFieldsMap';
import backlogFieldsMap from './BacklogFieldsMap';
import './index.less';
import Logs from './components/Logs';
import DynamicSearch from './components/dynamic-search';
import { useProjectDynamicChartStore } from './stores';

const ProjectDynamic = () => {
  const clsPrefix = 'c7n-project-overview-projectDynamic';
  const {
    projectDynamicDs,
    loadData,
  } = useProjectDynamicChartStore();

  const fieldsMap = new Map([...issueFieldsMap, ...backlogFieldsMap]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLoadMore = useCallback(() => {
    projectDynamicDs.queryMore(projectDynamicDs.currentPage + 1);
  }, [projectDynamicDs]);

  const handleLoadFirstPage = useCallback(() => {
    projectDynamicDs.page(1);
  }, [projectDynamicDs]);
  function render() {
    if (projectDynamicDs.status === 'loading') {
      return <AnimationLoading display />;
    }
    return projectDynamicDs.toData().length > 0 ? (
      <div className={`${clsPrefix}-content`}>
        <Logs
          datalogs={projectDynamicDs.toData()}
          fieldsMap={fieldsMap}
        />
        <div style={{
          marginTop: 10,
        }}
        >
          {
            projectDynamicDs.totalPage > projectDynamicDs.currentPage && (
              <Button
                onClick={handleLoadMore}
                style={{
                  color: '#3f51b5',
                }}
              >
                <span>查看更多</span>
                <Icon type="baseline-arrow_right icon" style={{ marginRight: 2 }} />
              </Button>
            )
          }
          {
            projectDynamicDs.totalPage > 1 && projectDynamicDs.totalPage === projectDynamicDs.currentPage && (
              <Button
                onClick={handleLoadFirstPage}
                style={{
                  color: '#3f51b5',
                }}
              >
                <span>收起</span>
                <Icon type="baseline-arrow_drop_up icon" style={{ marginRight: 2 }} />
              </Button>
            )
          }
        </div>
      </div>
    ) : (
      <EmptyPage content="当前条件下暂无动态" />
    );
  }
  return (
    <OverviewWrap>
      <OverviewWrap.Header
        title="项目动态"
        style={{
          margin: '0 0 10px 4px',
        }}
      >
        <DynamicSearch />
      </OverviewWrap.Header>
      <OverviewWrap.Content className={`${clsPrefix}-wrap`}>
        {render()}
      </OverviewWrap.Content>
    </OverviewWrap>
  );
};

export default observer(ProjectDynamic);
