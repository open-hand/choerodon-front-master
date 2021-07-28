import React, { useMemo, useState } from 'react';
import {
  Tree,
} from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import { omit } from 'lodash';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionNode from '../question-node';

import QuestionSearch, { questionSearchFields } from '../question-search';
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

  function nodeRenderer({ record }) {
    return (
      <QuestionNode
        record={record}
        organizationId={organizationId}
        history={history}
        switchCode="all"
      />
    );
  }

  function getContent() {
    if ((!questionDs || questionDs.status === 'loading') && !btnLoading) {
      return <LoadingBar display />;
    }
    if (!questionDs.length) {
      return (
        <EmptyPage
          title="暂无待办问题"
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
        <Tree
          dataSet={questionDs}
          renderer={nodeRenderer}
          className="c7n-todoQuestion-issueContent"
        />
        {questionStore.getHasMore ? component
          : null}
      </>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <span>
        <span>待办事项</span>
        <span className={`${prefixCls}-title-count`}>{questionStore.getTotalCount}</span>
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
