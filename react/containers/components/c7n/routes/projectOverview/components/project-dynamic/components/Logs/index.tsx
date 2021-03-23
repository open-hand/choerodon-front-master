import React from 'react';
import { Tooltip } from 'choerodon-ui';
import TimeAgo from 'timeago-react';
import './Logs.less';
import UserInfo from '@/containers/components/c7n/components/user-info';
import Log, { ILog } from './Log';

interface ILogConfig {
  operation?: string, // 操作名字
  render?: Function, // 定义这次操作的渲染
  transform?: Function, // 转换字段值
  condition?: Function, // 自定义判断条件
  hidden?: boolean, // 是否隐藏字段值
  dontJudge?: boolean, // 不进行判断
}

interface ILogTypeConfig {
  name?: string,
  create?: ILogConfig,
  update?: ILogConfig,
  delete?: ILogConfig,
  customRender?: Function,
}

export type IFieldMap = Map<string, ILogTypeConfig>

interface Props {
  datalogs: ILog[],
  fieldsMap: IFieldMap,
}
const Logs: React.FC<Props> = ({ datalogs, fieldsMap }) => (
  <div className="c7n-projectDynamic">
    {
      (datalogs || []).map((log: ILog, i: number, arr: ILog[]) => (
        <div key={log.logId} className="c7n-projectDynamic-log">
          <div
            className="c7n-projectDynamic-log-user"
          >
            {
                i && log.createdBy === arr[i - 1].createdBy ? null : (
                  <UserInfo
                    {...log.createdByUser}
                    showName={false}
                    avatarProps={{
                      style: {
                        width: 40,
                        height: 40,
                        lineHeight: '40px',
                      },
                    }}
                  />
                )
            }
          </div>
          <div className="c7n-projectDynamic-log-right">
            <div className="c7n-projectDynamic-log-logOperation">
              <span className="c7n-projectDynamic-log-userName">{log.createdByUser?.realName}</span>
              <Log log={log} fieldsMap={fieldsMap} />
            </div>
            <div className="c7n-projectDynamic-log-lastUpdateDate">
              <Tooltip placement="top" title={log.creationDate || ''}>
                <TimeAgo
                  datetime={log.creationDate || ''}
                  locale="zh_CN"
                />
              </Tooltip>
            </div>
          </div>
        </div>
      ))
      }
  </div>
);
export default Logs;
