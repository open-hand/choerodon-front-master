import React from 'react';
import { observer } from 'mobx-react-lite';
import UserInfo from '@/containers/components/c7n/components/user-info';
import HistoryItem from './HistoryItem';
import { DemandDetailStore } from '../../../../../stores/DetailStore';
import { ApproveLog } from '../../../../../common/types';
import './HistoryList.less';

const prefix = 'c7n-backlogApprove-historyList';

const HistoryList: React.FC<{
  expand: boolean, store: DemandDetailStore
}> = ({ expand, store }) => {
  const { approveLogs } = store;
  return (
    <div className={`${prefix}`}>
      {
      (approveLogs || []).map((log: ApproveLog, i: number, arr: ApproveLog[]) => ((i >= 4 && expand) || i < 5) && (
        <div key={log.taskHistoryId} className={`${prefix}-log`}>
          <div
            className={`${prefix}-log-user`}
          >
            {
                i && log.assignee && (log.assignee?.id === arr[i - 1].assignee?.id) ? null : (
                  <>
                    {
                      log.nodeType === 'startNode' || log.nodeType === 'endNode' ? (
                        <div className={`${prefix}-log-user-startOrEnd`}>
                          {
                            log.nodeType === 'startNode' ? '开始' : '结束'
                          }
                        </div>
                      ) : (
                        // @ts-ignore
                        <UserInfo
                          {
                            ...(log.assignee || {})
                          }
                          showName={false}
                          avatarProps={{
                            style: {
                              borderRadius: 4,
                              width: 40,
                              height: 40,
                            },
                          }}
                        />
                      )
                    }
                  </>
                )
            }
          </div>
          <div className={`${prefix}-log-right`}>
            <div className={`${prefix}-log-logOperation`}>
              <HistoryItem log={log} />
            </div>
            <div className={`${prefix}-log-lastUpdateDate`}>
              {log.endDate || ''}
            </div>
          </div>
        </div>
      ))
      }
    </div>
  );
};

export default observer(HistoryList);
