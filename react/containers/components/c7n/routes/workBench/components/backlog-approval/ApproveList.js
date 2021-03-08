import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Dropdown, Menu } from 'choerodon-ui';
import { Button } from 'choerodon-ui/pro';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import { useApproveStore } from './stores';
import EmptyImg from './image/empty.svg';
import ApproveTable from './components/approve-table';
import './ApproveList.less';

const ApproveList = () => {
  const {
    approveListDs,
  } = useApproveStore();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="https://choerodon.io/">
          <span>我参与的流程</span>
          <Button className="c7n-backlogApprove-title-right-hrefBtn" shape="circle" icon="trending_flat" />
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="https://choerodon.io/">
          <span>我发起的流程</span>
          <Button className="c7n-backlogApprove-title-right-hrefBtn" shape="circle" icon="trending_flat" />
        </a>
      </Menu.Item>
      <Menu.Item key="3">
        <a>
          <span>抄送我的流程</span>
          <Button className="c7n-backlogApprove-title-right-hrefBtn" shape="circle" icon="trending_flat" />
        </a>
      </Menu.Item>
    </Menu>
  );

  const renderTitleRight = useCallback(() => (
    <div className="c7n-backlogApprove-title-right">
      <Dropdown
        overlay={menu}
        trigger="click"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        className="c7n-backlogApprove-title-right-dropdown"
      >
        <Button className="c7n-backlogApprove-title-right-btn" shape="circle" icon="more_vert" funcType="raised" />
      </Dropdown>
    </div>
  ), [menu]);

  return (
    <div className="c7n-backlogApprove">
      <div className="c7n-backlogApprove-title">
        <div>
          <span>待审核的需求</span>
          <span className="c7n-backlogApprove-title-count">{approveListDs.totalCount}</span>
        </div>
        {renderTitleRight()}
      </div>
      <div className="c7n-backlogApprove-content">
        {approveListDs.length > 0 ? (
          <ApproveTable />
        ) : (
          <EmptyPage title="暂无待审核的需求" describe="暂无待审核的需求" img={EmptyImg} />
        )}
      </div>
    </div>
  );
};

export default observer(ApproveList);
