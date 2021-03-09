import React from 'react';
import { ApproveLog } from '../../../../../common/types';
import './HistoryItem.less';

const prefix = 'c7n-backlogApprove-historyItem';

interface LogProps {
  log: ApproveLog,
}
const HistoryItem: React.FC<LogProps> = ({ log }) => {
  const {
    nodeType, nodeName, statusMeaning, commentContent, remark, attachmentUuid, assignee,
  } = log;

  return (
    <div className={prefix}>
      {
        nodeType === 'startNode' && (
          <span>审核流程开始</span>
        )
      }
      {
        nodeType === 'endNode' && (
          <span>审核流程结束</span>
        )
      }
      {
        nodeType !== 'startNode' && nodeType !== 'endNode' && (
          <>
            <span
              className={`${prefix}-value`}
              style={{
                marginRight: 5,
              }}
            >
              {`${assignee?.realName}`}
            </span>
            <span>在</span>
            <span className={`${prefix}-value`}>{`【${nodeName}】`}</span>
            <span>操作审批动作为</span>
            <span className={`${prefix}-value`}>{`【${statusMeaning}】`}</span>
            {
              commentContent && (
              <>
                <span>填写审批意见</span>
                <span className={`${prefix}-value`}>{`【${commentContent}】`}</span>
              </>
              )
            }
            {
              remark && (
                <>
                  <span>填写备注</span>
                  <span className={`${prefix}-value`}>{`【${remark}】`}</span>
                </>
              )
            }
            {
              attachmentUuid && (
                <>
                  <span>上传附件</span>
                  <span className={`${prefix}-value`}>{`【${attachmentUuid}】`}</span>
                </>
              )
            }
          </>
        )
      }
    </div>
  );
};

export default HistoryItem;
