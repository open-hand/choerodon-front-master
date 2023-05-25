import React, {
  useState, useMemo, useCallback,
} from 'react';
import { Spin, Tooltip } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { clone, find, omit } from 'lodash';
import { Loading } from '@zknow/components';
import ScrollContext from 'react-infinite-scroll-component';
import EmptyPage from '@/containers/components/c7n/components/empty-page';
import Card from '@/containers/components/c7n/routes/workBench/components/card';
import Switch from '@/containers/components/c7n/routes/workBench/components/multiple-switch';
import { useTodoQuestionStore } from './stores';
import emptyImg from './image/empty.svg';
import QuestionSearch, { questionSearchFields } from '../question-search';
import QuestionTree from '../question-tree';
import QuestionCount from '../question-count';

import './index.less';
import { useWorkBenchStore } from '../../stores';

const HAS_BACKLOG = window.agile;
const HAS_AGILEPRO = window.agile;
const TodoQuestion = observer(() => {
  const {
    formatWorkbench,
    formatCommon,
  } = useWorkBenchStore();
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

  const searchField = useMemo(() => {
    const showCodes = ['contents'];
    tabKey === 'myStarBeacon_backlog' ? showCodes.push('backlogStatus', 'backlogPriority', 'handler')
      : showCodes.push('status', 'priority', 'assignee');
    const newFields = questionSearchFields.filter((i) => showCodes.includes(i.code));
    if (tabKey === 'myStarBeacon_backlog') {
      return newFields;
    }
    const issueTypeField = find(questionSearchFields, { code: 'issueType' });
    if (window.agile) {
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
    questionStore.setPage(1);
    questionDs.setQueryParameter('searchData', omit(search, '_id'));
    // eslint-disable-next-line no-underscore-dangle
    questionDs.setQueryParameter('searchDataId', search._id);
    questionDs.query();
  }
  const emptyPrompt = useMemo(() => {
    const [title, describe] = tabKey === 'myStarBeacon' ? [formatWorkbench({ id: 'noAttentionIssues' }), formatWorkbench({ id: 'noAttentionIssues.desc' })] : [formatWorkbench({ id: 'noAttentionIssues' }), formatWorkbench({ id: 'noAttentionIssues.desc' })];
    return { title, describe };
  }, [tabKey]);

  const loadMoreData = useCallback(async () => {
    questionStore.setPage(questionStore.getPage + 1);
    questionDs.query();
  }, [questionDs]);

  const handleTabChange = useCallback((key) => {
    questionStore.changeTabKey(key);
    questionStore.setPage(1);
  }, [questionStore]);
  const handleClickStar = useCallback((record) => {
    questionStore.cancelStar(record?.issueId || record?.id, record?.projectId);
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
            isStar
            dataSet={questionDs}
            onClickStar={handleClickStar}
            switchCode={tabKey}
          />
        </ScrollContext>
      </Spin>
    );
  }

  const renderTitle = () => (
    <div className={`${prefixCls}-title`}>
      <div className={`${prefixCls}-title-left`}>
        <span>{formatWorkbench({ id: 'myAttention' })}</span>
        <QuestionCount count={questionStore.getTotalCount} />
      </div>
      <span className={`${prefixCls}-title-right`}>
        <QuestionSearch key={`QuestionSearch-${questionDs.id}`} onQuery={load} fields={searchField} />
        {window.agile && (
          <Switch
            defaultValue="myStarBeacon"
            value={tabKey}
            options={[
              { value: 'myStarBeacon', text: '工作项' },
              { value: 'myStarBeacon_backlog', text: formatCommon({ id: 'demand' }) },
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
          paddingTop: window.agile ? '.13rem' : '.2rem',
        }}
      >
        {getContent()}
      </Card>
    </div>
  );
});

export default TodoQuestion;
