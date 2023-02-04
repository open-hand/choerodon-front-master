import React, { useMemo, useState } from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { omit } from 'lodash';
import { Loading } from '@zknow/components';
import ScrollContext from 'react-infinite-scroll-component';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionSearch, { questionSearchFields } from '../question-search';
import QuestionTree from '../question-tree';
import QuestionCount from '../question-count';

import './index.less';

const TodoQuestion = observer(() => {
  const {
    organizationId,
    questionDs,
    history,
    prefixCls,
    questionStore,
  } = useTodoQuestionStore();

  const searchField = useMemo(() => questionSearchFields.filter((i) => ['contents', 'issueType', 'status', 'priority', 'assignee'].includes(i.code)), []);

  function load(search) {
    questionStore.setPage(1);
    questionDs.setQueryParameter('searchData', omit(search, '_id'));
    // eslint-disable-next-line no-underscore-dangle
    questionDs.setQueryParameter('searchDataId', search._id);
    questionDs.query();
  }
  const loadMoreData = async () => {
    questionStore.setPage(questionStore.getPage + 1);
    questionDs.query();
  };

  function getContent() {
    if (!questionDs.length && questionDs.currentPage === 1) {
      return (
        <EmptyPage
          title="暂无报告我的问题"
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>当前迭代暂无待办问题</span>}
        />
      );
    }
    return (
      <Spin spinning={questionDs.status === 'loading'}>
        <ScrollContext
          className={`${prefixCls}-scroll`}
          dataLength={questionDs.length}
          next={loadMoreData}
          hasMore={questionStore.getHasMore}
          height="100%"
          endMessage={(
            <span
              style={{ height: !questionStore.getHasMore ? '1.32rem' : 'auto' }}
              className={`${prefixCls}-scroll-bottom`}
            >
              {questionStore.getHasMore ? '到底了' : ''}
            </span>
          )}
        >
          <QuestionTree
            treeData={questionStore.getTreeData}
            organizationId={organizationId}
            dataSet={questionDs}
            isStar
          />
        </ScrollContext>
      </Spin>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <span className={`${prefixCls}-title-left`}>
        <span>我报告的</span>
        <QuestionCount count={questionStore.getTotalCount} />
      </span>
      <QuestionSearch onQuery={load} fields={searchField} key={`QuestionSearch-${questionDs.id}`} />

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

export default TodoQuestion;
