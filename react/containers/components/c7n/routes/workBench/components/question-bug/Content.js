import React, {
  useState, useCallback, useMemo,
} from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { omit } from 'lodash';
import { Loading } from '@choerodon/components';
import ScrollContext from 'react-infinite-scroll-component';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import Switch from '@/containers/components/c7n/routes/workBench/components/multiple-switch';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionNode from '../question-node';
import { useWorkBenchStore } from '../../stores';
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

  const {
    formatWorkbench,
  } = useWorkBenchStore();
  const {
    tabKey,
  } = questionStore;

  const searchField = useMemo(() => {
    const showCodes = ['contents', 'status', 'priority', 'assignee'];
    tabKey === 'myBug' && showCodes.pop();
    return questionSearchFields.filter((i) => showCodes.includes(i.code));
  }, [tabKey]);

  function load(search) {
    questionStore.setPage(1);
    questionDs.setQueryParameter('searchData', omit(search, '_id'));
    // eslint-disable-next-line no-underscore-dangle
    questionDs.setQueryParameter('searchDataId', search._id);
    questionDs.query();
  }

  const emptyPrompt = useMemo(() => {
    const [title, describe] = tabKey === 'reportedBug' ? ['暂无已提缺陷', '当前迭代您尚未提交任何缺陷'] : [formatWorkbench({ id: 'noTodo' }), formatWorkbench({ id: 'noTodo.desc' })];
    return { title, describe };
  }, [tabKey]);

  const loadMoreData = useCallback(async () => {
    questionStore.setPage(questionStore.getPage + 1);
    questionDs.query();
  }, [questionDs, questionStore]);

  const handleTabChange = useCallback((key) => {
    questionStore.changeTabKey(key);
    questionStore.setPage(1);
  }, [questionStore]);

  function getContent() {
    if (!questionDs.length && questionDs.currentPage === 1) {
      return (
        <EmptyPage
          title={emptyPrompt.title}
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>{emptyPrompt.describe}</span>}
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
            switchCode={tabKey}
          />
        </ScrollContext>
      </Spin>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <div className={`${prefixCls}-title-left`}>
        <span>缺陷</span>
        <QuestionCount count={questionStore.getTotalCount} />
      </div>
      <span className={`${prefixCls}-title-right`}>
        <QuestionSearch key={`c7n-focus-QuestionSearch-${tabKey}-${questionDs.id}`} onQuery={load} fields={searchField} />

        <Switch
          defaultValue="myStarBeacon"
          value={tabKey}
          options={[
            { value: 'myBug', text: '待修复缺陷' },
            { value: 'reportedBug', text: '已提缺陷' },
          ]}
          onChange={handleTabChange}
        />
      </span>
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
