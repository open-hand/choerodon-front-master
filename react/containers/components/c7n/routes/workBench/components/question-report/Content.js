import React, { useMemo, useState } from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { omit } from 'lodash';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import { Loading } from '@choerodon/components';
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

  const [btnLoading, changeBtnLoading] = useState(false);
  const searchField = useMemo(() => questionSearchFields.filter((i) => ['contents', 'issueType', 'status', 'priority', 'assignee'].includes(i.code)), []);

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
          title="暂无报告我的问题"
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>当前迭代暂无待办问题</span>}
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
        <QuestionTree
          treeData={questionStore.getTreeData}
          organizationId={organizationId}
          isStar
        />
        {questionStore.getHasMore ? component
          : null}
      </>
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
