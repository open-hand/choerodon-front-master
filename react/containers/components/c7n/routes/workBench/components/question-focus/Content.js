import React, {
  useState, useMemo, useCallback,
} from 'react';
import { Tree } from 'choerodon-ui/pro';
import J from 'choerodon-ui/pro/lib/tooltip';
import { Spin, Tooltip } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { clone, find, omit } from 'lodash';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import LoadingBar from '@/containers/components/c7n/tools/loading-bar';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import Switch from '@/containers/components/c7n/routes/workBench/components/multiple-switch';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionSearch, { questionSearchFields } from '../question-search';
import QuestionTree from '../question-tree';

import './index.less';

import QuestionNode from '../question-node';

const HAS_BACKLOG = C7NHasModule('@choerodon/backlog');
const HAS_AGILEPRO = C7NHasModule('@choerodon/agile-pro');
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
  const searchField = useMemo(() => {
    const showCodes = ['contents'];
    tabKey === 'myStarBeacon_backlog' ? showCodes.push('backlogStatus', 'backlogPriority', 'handler')
      : showCodes.push('status', 'priority', 'assignee');
    const newFields = questionSearchFields.filter((i) => showCodes.includes(i.code));
    if (tabKey === 'myStarBeacon_backlog') {
      return newFields;
    }
    const issueTypeField = find(questionSearchFields, { code: 'issueType' });
    if (HAS_AGILEPRO) {
      newFields.push({
        ...issueTypeField,
        selectConfig: {
          paging: false,
          ...issueTypeField.selectConfig,
          data: [...issueTypeField.selectConfig.data,
            { meaning: '特性', value: 'feature' }],
        },
      });
    } else {
      newFields.unshift(issueTypeField);
    }
    return newFields;
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
        <QuestionTree
          treeData={questionStore.getTreeData}
          organizationId={organizationId}
          isStar
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
        <span>我的关注</span>
        <Tooltip title={questionStore.getTotalCount}>
          <span className={`${prefixCls}-title-count`}>{questionStore.getTotalCount}</span>
        </Tooltip>
      </div>
      <span className={`${prefixCls}-title-right`}>
        <QuestionSearch key={`QuestionSearch-${questionDs.id}`} onQuery={load} fields={searchField} />
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
      </span>
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
