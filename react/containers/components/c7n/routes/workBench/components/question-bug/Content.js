import React, {
  useState, useCallback, useMemo,
} from 'react';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { omit } from 'lodash';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import { Loading } from '@choerodon/components';
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
    selectedProjectId,
  } = useWorkBenchStore();
  const {
    tabKey,
  } = questionStore;

  const [btnLoading, changeBtnLoading] = useState(false);
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
    const [title, describe] = tabKey === 'reportedBug' ? ['暂无已提缺陷', '当前迭代您尚未提交任何缺陷'] : ['暂无待办问题', '当前迭代暂无待办问题'];
    return { title, describe };
  }, [tabKey]);

  const loadMoreData = useCallback(() => {
    changeBtnLoading(true);
    questionStore.setPage(questionStore.getPage + 1);
    questionDs.query().finally(() => {
      changeBtnLoading(false);
    });
  }, [questionDs, questionStore]);

  const handleTabChange = useCallback((key) => {
    questionStore.changeTabKey(key);
    questionStore.setPage(1);
  }, [questionStore]);

  function getContent() {
    if ((!questionDs || questionDs.status === 'loading') && !btnLoading) {
      return <Loading display />;
    }
    if (!questionDs.length) {
      return (
        <EmptyPage
          title={emptyPrompt.title}
          img={emptyImg}
          describe={<span style={{ whiteSpace: 'nowrap' }}>{emptyPrompt.describe}</span>}
        />
      );
    }
    let component = <Spin spinning />;
    if (!btnLoading) {
      component = (
        <div
          role="none"
          onClick={() => loadMoreData()}
          className={`${prefixCls}-issueContent-more`}
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
          switchCode={tabKey}
        />
        {questionStore.getHasMore ? component
          : null}
      </>
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
