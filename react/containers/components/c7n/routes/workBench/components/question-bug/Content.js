import React, {
  useState, useCallback, useMemo,
} from 'react';
import { Tree, Tooltip } from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import Switch from '@/containers/components/c7n/routes/workBench/components/multiple-switch';
import { omit } from 'lodash';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionNode from '../question-node';

import './index.less';
import { useWorkBenchStore } from '../../stores';
import QuestionSearch, { questionSearchFields } from '../question-search';

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
    const showCodes = ['contents', 'status', 'assignee'];
    tabKey === 'myBug' && showCodes.pop();
    return questionSearchFields.filter((i) => showCodes.includes(i.code));
  }, [tabKey]);

  function load(search) {
    console.log('search :>> ', search);
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

  const nodeRenderer = useCallback(({ record }) => (
    <QuestionNode
      record={record}
      organizationId={organizationId}
      history={history}
      switchCode={tabKey}
    />
  ), [organizationId, history, tabKey]);

  function getContent() {
    if ((!questionDs || questionDs.status === 'loading') && !btnLoading) {
      return <LoadingBar display />;
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
        <Tree
          dataSet={questionDs}
          renderer={nodeRenderer}
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
        <Tooltip title={questionStore.getTotalCount}>
          <span className={`${prefixCls}-title-count`}>{questionStore.getTotalCount}</span>
        </Tooltip>
      </div>
      <span className={`${prefixCls}-title-right`}>
        <QuestionSearch key={`c7n-focus-QuestionSearch-${tabKey}-${questionDs.id}`} onQuery={load} fields={searchField} />

        <Switch
          defaultValue="myStarBeacon"
          value={tabKey}
          options={[
            { value: 'reportedBug', text: '已提缺陷' },
            { value: 'myBug', text: '待修复缺陷' },
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
