import React, { useCallback } from 'react';
import {
  Button, Icon, Spin,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';

import OverviewWrap from '../OverviewWrap';
import { useProjectOverviewStore } from '../../stores';
import issueFieldsMap from './IssueFieldsMap';
import backlogFieldsMap from './BacklogFieldsMap';
import './index.less';
import Logs from './components/Logs';
import DynamicSearch from './components/dynamic-search';

const ProjectDynamic = () => {
  const clsPrefix = 'c7n-project-overview-projectDynamic';
  const {
    projectDynamicDs,
  } = useProjectOverviewStore();
  const fieldsMap = new Map([...issueFieldsMap, ...backlogFieldsMap]);

  const handleLoadMore = useCallback(() => {
    projectDynamicDs.queryMore(projectDynamicDs.currentPage + 1);
  }, [projectDynamicDs]);

  console.log(projectDynamicDs.totalPage, projectDynamicDs.currentPage);
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
        <Spin spinning={projectDynamicDs.status === 'loading'}>
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
            </div>
          </div>
        </Spin>
      </OverviewWrap.Content>
    </OverviewWrap>
  );
};

export default observer(ProjectDynamic);
