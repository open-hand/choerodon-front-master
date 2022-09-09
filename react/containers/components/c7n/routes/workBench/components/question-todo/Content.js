/* eslint-disable react/jsx-no-bind */
import React, {
  useMemo, useState, useEffect,
} from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import {
  omit,
  get,
} from 'lodash';
import { Loading } from '@choerodon/components';
import ScrollContext from 'react-infinite-scroll-component';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionSearch, { questionSearchFields } from '../question-search';
import QuestionTree from '../question-tree';
import QuestionCount from '../question-count';
import './index.less';
import { useWorkBenchStore } from '../../stores';

const TodoQuestion = observer(() => {
  const {
    formatWorkbench,
    formatCommon,
  } = useWorkBenchStore();

  const {
    organizationId,
    questionDs,
    prefixCls,
    questionStore,
    height,
  } = useTodoQuestionStore();
  const [btnLoading, changeBtnLoading] = useState(false);
  const [containerHeight, setContainerHeight] = useState();
  const searchField = useMemo(() => questionSearchFields.filter((i) => ['contents', 'issueType', 'status', 'priority'].includes(i.code)), []);

  function load(search) {
    questionStore.setPage(1);
    questionStore.setSize(height * 4 + 4);
    questionDs.setQueryParameter('searchData', omit(search, '_id'));
    // eslint-disable-next-line no-underscore-dangle
    questionDs.setQueryParameter('searchDataId', search._id);
    questionStore.setSize(height * 4 + 4);

    questionDs.query();
  }
  const loadMoreData = async () => {
    changeBtnLoading(true);
    questionStore.setSize(height * 4 + 4);
    questionStore.setPage(questionStore.getPage + 1);
    questionStore.setSize(height * 4 + 4);
    questionDs.query().finally(() => {
      changeBtnLoading(false);
    });
  };

  function getContent() {
    if (!questionDs.length && questionDs.currentPage === 1) {
      return (
        <EmptyPage
          title={formatWorkbench({ id: 'noTodo' })}
          img={emptyImg}
          describe={(
            <span style={{ whiteSpace: 'nowrap' }}>
              {
                  formatWorkbench({ id: 'noTodo.desc' })
                }
            </span>
    )}
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
          />
        </ScrollContext>
      </Spin>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <span>
        <span>{formatWorkbench({ id: 'todo' })}</span>
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
