import React, { useMemo, useState } from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { omit } from 'lodash';
import { Loading } from '@choerodon/components';
import ScrollContext from 'react-infinite-scroll-component';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import { useMyHandler } from './stores';
import emptyImg from './image/empty.svg';
import QuestionSearch, { questionSearchFields } from '../question-search';
import QuestionTree from '../question-tree';
import QuestionCount from '../question-count';

import './MyHandler.less';

const MyHandler = observer(() => {
  const {
    organizationId,
    myHandlerDs,
    prefixCls,
    myHandlerStore,
  } = useMyHandler();

  const searchField = useMemo(() => questionSearchFields.filter((i) => ['contents', 'issueType', 'status', 'priority', 'assignee'].includes(i.code)), []);

  function load(search) {
    myHandlerStore.setPage(1);
    myHandlerDs.setQueryParameter('searchData', omit(search, '_id'));
    // eslint-disable-next-line no-underscore-dangle
    myHandlerDs.setQueryParameter('searchDataId', search._id);
    myHandlerDs.query();
  }
  const loadMoreData = async () => {
    myHandlerStore.setPage(myHandlerStore.getPage + 1);
    myHandlerDs.query();
  };

  function getContent() {
    if (myHandlerStore.getTreeData < 0) {
      return (
        <EmptyPage
          title="暂无我经手的问题"
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>当前迭代暂无我经手的问题</span>}
        />
      );
    }

    return (
      <Spin spinning={myHandlerDs.status === 'loading'}>
        <ScrollContext
          className={`${prefixCls}-scroll`}
          dataLength={myHandlerDs.length}
          next={loadMoreData}
          hasMore={myHandlerStore.getHasMore}
          height="100%"
          endMessage={(
            <span
              style={{ height: !myHandlerStore.getHasMore ? '1.32rem' : 'auto' }}
              className={`${prefixCls}-scroll-bottom`}
            >
              {myHandlerStore.getHasMore ? '到底了' : ''}
            </span>
      )}
        >
          <QuestionTree
            treeData={myHandlerStore.getTreeData}
            organizationId={organizationId}
            isStar
          />
        </ScrollContext>
      </Spin>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <span>
        <span>我经手的</span>
        <QuestionCount count={myHandlerStore.getTotalCount} />
      </span>
      <QuestionSearch onQuery={load} fields={searchField} key={`QuestionSearch-${myHandlerDs.id}`} />
    </div>

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
