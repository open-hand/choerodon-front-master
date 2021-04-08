import React, {
  useState, useMemo, useCallback,
} from 'react';
import { Tree } from 'choerodon-ui/pro';
import { Spin } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import Switch from '@/containers/components/c7n/routes/workBench/components/multiple-switch';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';

import './index.less';

import QuestionNode from '../question-node';

const HAS_BACKLOG = C7NHasModule('@choerodon/backlog');

const TodoQuestion = observer(() => {
  const {
    organizationId,
    questionDs,
    history,
    prefixCls,
    questionStore,
  } = useTodoQuestionStore();

  const {
    tabKey,
  } = questionStore;

  const [btnLoading, changeBtnLoading] = useState(false);

  const emptyPrompt = useMemo(() => {
    const [title, describe] = tabKey === 'myStarBeacon' ? ['暂无我关注的问题', '您尚未关注任何问题项'] : ['暂无我关注的需求', '您尚未关注任何需求'];
    return { title, describe };
  }, [tabKey]);

  const loadMoreData = useCallback(() => {
    changeBtnLoading(true);
    questionStore.setPage(questionStore.getPage + 1);
    questionDs.query().finally(() => {
      changeBtnLoading(false);
    });
  }, [questionDs]);

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
      isStar
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
          onTreeNode={({ record }) => (record.get('parentId') ? {} : { className: 'c7ncd-question-issue-root-node' })}
        />
        {questionStore.getHasMore ? component
          : null}
      </>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <div>
        <span>我的关注</span>
        <span className={`${prefixCls}-title-count`}>{questionStore.getTotalCount}</span>
      </div>
      {HAS_BACKLOG && (
        <Switch
          defaultValue="myStarBeacon"
          value={tabKey}
          options={[
            { value: 'myStarBeacon', text: '问题' },
            { value: 'myStarBeacon_backlog', text: '需求' },
          ]}
          onChange={handleTabChange}
        />
      )}
    </div>
  );

  return (
    <div className={prefixCls}>
      <Card
        title={renderTitle()}
        className={`${prefixCls}-issueContent`}
        style={{
          paddingTop: HAS_BACKLOG ? '.13rem' : '.2rem',
        }}
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
