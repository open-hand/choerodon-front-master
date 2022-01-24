import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Select, Tooltip, Pagination } from 'choerodon-ui/pro';
import { UserInfo, TimePopover } from '@choerodon/components';
import { map } from 'lodash';
import { useRequestChartStore } from './stores';
import OverviewWrap from '../OverviewWrap';
import EmptyPage from '../EmptyPage';

const { Header } = OverviewWrap as any;
const RequestChart = () => {
  const {
    mainStore,
    prefixCls,
    requestListDs,
    AppServiceDs,
  } = useRequestChartStore();

  useEffect(() => {

  }, []);

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <span>待审核合并请求</span>
    </div>
  );

  const renderOptionProperty = ({ record }:any) => {
    const isAvailable = record.get('accessLevel') <= 20;
    return ({
      disabled: isAvailable,
    });
  };

  const renderAppServive = ({ record }:any) => (
    <Tooltip title={record.get('accessLevel') <= 20 ? '您在此服务下为Guest权限，无法选择' : ''}>
      <span>
        {record.get('name')}
        （
        {record.get('code')}
        ）
      </span>
    </Tooltip>
  );
  const handleSelectChange = (value :any) => {
    const ids = map(value, 'id');
    requestListDs.setQueryParameter('app_service_ids', ids.join());
    requestListDs.query();
  };
  return (
    <OverviewWrap>
      <Header
        titleMarginBottom={12}
        title={renderTitle()}
        style={{
          margin: '0 0 10px 4px',
        }}
      >
        <Select
          multiple
          className={`${prefixCls}-select`}
          dataSet={AppServiceDs} // 不要绑在requestListDs上，会导致点击之后requestListDs改变select框每次都会刷新的问题，如果是多选就没有效果
          onChange={handleSelectChange}
          name="appService"
          optionRenderer={renderAppServive}
          placeholder="应用服务"
          onOption={renderOptionProperty}
          searchable
          searchMatcher="key"
        />
      </Header>
      <div className={`${prefixCls}-list-header`}>
        <div className={`${prefixCls}-list-header-item`}>应用服务</div>
        <div className={`${prefixCls}-list-header-item`}>合并请求</div>
        <div className={`${prefixCls}-list-header-item`}>创建</div>
        <div className={`${prefixCls}-list-header-item`}>审核人</div>
      </div>
      {requestListDs.length ? (
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-request-list-container`}>
            {requestListDs.map((record:any) => {
              const {
                appServiceName, iamAssignee, iamAuthor, title, createdAt, gitlabMergeRequestId, gitlabUrl,
              } = record.toData();
              return (
                <div className={`${prefixCls}-request-list-header`}>
                  <div className={`${prefixCls}-request-list-header-item`}>

                    <span className={`${prefixCls}-request-list-header-item-content`}>
                      <Tooltip title={appServiceName}>{appServiceName}</Tooltip>
                    </span>
                  </div>
                  <div className={`${prefixCls}-request-list-header-item`}>
                    <Tooltip title={title}><span className={`${prefixCls}-request-list-header-item-content`}><a href={gitlabUrl}>{title}</a></span></Tooltip>
                    <div>
                      !
                      {gitlabMergeRequestId}
                    </div>
                  </div>
                  <div className={`${prefixCls}-request-list-header-item`}>
                    {iamAuthor
                      ? (
                        <Tooltip title={iamAuthor.ldap ? `${iamAuthor.realName}(${iamAuthor.loginName})` : `${iamAuthor.realName}(${iamAuthor.email})`}>
                          <div>
                            <UserInfo
                              avatar={iamAuthor?.imageUrl}
                              realName={iamAuthor?.realName}
                              loginName={iamAuthor?.loginName}
                              showTooltip
                              className={`${prefixCls}-request-list-user`}
                            />

                          </div>
                          <div>
                            <TimePopover content={createdAt} />
                          </div>
                        </Tooltip>
                      ) : ''}

                  </div>
                  <div className={`${prefixCls}-request-list-header-item`}>
                    {iamAssignee ? (
                      <Tooltip title={iamAssignee.ldap ? `${iamAssignee.realName}(${iamAssignee.loginName})` : `${iamAssignee.realName}(${iamAssignee.email})`}>
                        <div>
                          <UserInfo
                            avatar={iamAssignee?.imageUrl}
                            realName={iamAssignee?.realName}
                            loginName={iamAssignee?.loginName}
                            className={`${prefixCls}-request-list-user`}
                          />

                        </div>
                      </Tooltip>
                    ) : <span className={`${prefixCls}-request-list-user`}>未指派</span>}

                  </div>
                </div>

              );
            })}
          </div>
          {mainStore.totalRequestChart > 10 && (
            <Pagination
              dataSet={requestListDs}
              className={`${prefixCls}-pagination`}
            />
          )}
        </div>
      ) : <EmptyPage content="当前暂无待审核合并请求" />}

    </OverviewWrap>
  );
};

export default observer(RequestChart);
