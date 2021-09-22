import React, { useCallback, useEffect } from 'react';
import {
  Button, Icon, Spin,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import {
  pick,
} from 'lodash';
import { LoadingProvider, LoadingHiddenWrap } from '@choerodon/components';
import EmptyPage from '../EmptyPage';
import OverviewWrap from '../OverviewWrap';
import issueFieldsMap from './IssueFieldsMap';
import backlogFieldsMap from './BacklogFieldsMap';
import './index.less';
import Logs from './components/Logs';
import DynamicSearch from './components/dynamic-search';
import { useProjectDynamicChartStore } from './stores';

function randomString(len = 32) {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  for (let i = 0; i < len; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return code;
}

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
    const originDataLogs = projectDynamicDs.toData();
    const newDataLogs = [];
    let autoTemp = [];
    originDataLogs.forEach((log, i, logs) => {
      if (log.field !== 'Auto Resolution' && log.field !== 'Auto Trigger' && log.field !== 'Auto Status') {
        newDataLogs.push(log);
      }
      if (log.field === 'Auto Status' || log.field === 'Auto Trigger' || log.field === 'Auto Resolution') {
        if (log.field === 'Auto Trigger' || log.field === 'Auto Resolution') {
          autoTemp.push(log);
        } else if (log.field === 'Auto Status') {
          if (autoTemp.length > 0) {
            autoTemp.push(log);
            autoTemp = autoTemp.reverse();
            newDataLogs.push({
              ...autoTemp[0],
              ...pick(autoTemp[1], ['lastUpdateDate', 'creationDate']),
              logId: `autoUpdate-${randomString(10)}`, // 加入随机数 避免更改详情，增加日志时重复
              field: 'autoUpdate',
              newStatus: autoTemp[0].newString,
              trigger: autoTemp[1].newString,
              resolutionChanged: autoTemp.length === 3,
              removeResolution: autoTemp.length === 3 && autoTemp[2].oldValue && !autoTemp[2].newValue,
            });
          }
          autoTemp = [];
        }
      }
    });

    return newDataLogs.length > 0 ? (
      <div className={`${clsPrefix}-content`}>
        <Logs
          datalogs={newDataLogs}
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
      <LoadingHiddenWrap>
        <EmptyPage content="当前条件下暂无动态" />
      </LoadingHiddenWrap>
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
        <LoadingProvider loading={projectDynamicDs.status === 'loading'} style={{ height: '100%' }}>
          {render()}
        </LoadingProvider>
      </OverviewWrap.Content>
    </OverviewWrap>
  );
};

export default observer(ProjectDynamic);
