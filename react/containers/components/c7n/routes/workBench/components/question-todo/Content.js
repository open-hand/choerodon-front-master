import React, {
  useMemo, useState,
} from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import {
  omit,
} from 'lodash';
import { Loading } from '@choerodon/components';
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
  } = useTodoQuestionStore();
  const [btnLoading, changeBtnLoading] = useState(false);
  const searchField = useMemo(() => questionSearchFields.filter((i) => ['contents', 'issueType', 'status', 'priority'].includes(i.code)), []);

  function load(search) {
    questionStore.setPage(1);
    questionDs.setQueryParameter('searchData', omit(search, '_id'));
    // eslint-disable-next-line no-underscore-dangle
    questionDs.setQueryParameter('searchDataId', search._id);

    questionDs.query();
  }
  function loadMoreData() {
    changeBtnLoading(true);
    questionStore.setPage(questionStore.getPage + 1);
    questionDs.query().finally(() => {
      changeBtnLoading(false);
    });
  }

  function getContent() {
    if ((!questionDs || questionDs.status === 'loading') && !btnLoading) {
      return <Loading display />;
    }
    if (!questionDs.length) {
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
    let component = <Spin spinning />;
    if (!btnLoading) {
      component = (
        <div
          role="none"
          onClick={() => loadMoreData()}
          className={`${prefixCls}-more`}
        >
          {formatCommon({ id: 'loadMore' })}
        </div>
      );
    }
    return (
      <>
        <QuestionTree
          treeData={questionStore.getTreeData}
          organizationId={organizationId}
        />
        {questionStore.getHasMore ? component
          : null}
      </>
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
