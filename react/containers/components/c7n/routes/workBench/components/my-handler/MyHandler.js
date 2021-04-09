import React, { useState } from 'react';
import { Tree } from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import { useMyHandler } from './stores';
import emptyImg from './image/empty.svg';
import QuestionNode from '../question-node';

import './MyHandler.less';

const MyHandler = observer(() => {
  const {
    organizationId,
    myHandlerDs,
    history,
    prefixCls,
    myHandlerStore,
  } = useMyHandler();

  const [btnLoading, changeBtnLoading] = useState(false);

  function loadMoreData() {
    changeBtnLoading(true);
    myHandlerStore.setPage(myHandlerStore.getPage + 1);
    myHandlerDs.query().finally(() => {
      changeBtnLoading(false);
    });
  }

  function nodeRenderer({ record }) {
    return (
      <QuestionNode
        record={record}
        isStar
        organizationId={organizationId}
        history={history}
        switchCode="all"
      />
    );
  }

  function getContent() {
    if ((!myHandlerDs || myHandlerDs.status === 'loading') && !btnLoading) {
      return <LoadingBar display />;
    }
    if (!myHandlerDs.length) {
      return (
        <EmptyPage
          title="暂无我经手的问题"
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>当前迭代暂无我经手的问题</span>}
        />
      );
    }
    let component = <Spin spinning />;
    if (!btnLoading) {
      component = (
        <div
          role="none"
          onClick={() => loadMoreData()}
          className={`${prefixCls}-more`}
        >
          加载更多
        </div>
      );
    }
    return (
      <>
        <Tree
          dataSet={myHandlerDs}
          renderer={nodeRenderer}
          className="c7n-todoQuestion-issueContent"
          onTreeNode={({ record }) => (record.get('parentId') || record.level ? {} : { className: 'c7ncd-question-issue-root-node' })}
        />
        {myHandlerStore.getHasMore ? component
          : null}
      </>
    );
  }

  const renderTitle = () => (
    <>
      <span>我经手的</span>
      <span className={`${prefixCls}-title-count`}>{myHandlerStore.getTotalCount}</span>
    </>
  );

  return (
    <div className={prefixCls}>
      <Card
        title={renderTitle()}
        className={`${prefixCls}-issueContent`}
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default MyHandler;
