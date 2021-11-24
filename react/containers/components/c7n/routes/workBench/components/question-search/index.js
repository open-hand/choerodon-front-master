import React, {
  useEffect,
  useCallback, useMemo, useRef, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, TextField, Button, Dropdown, Form, DataSet,
} from 'choerodon-ui/pro';
import {
  cloneDeep,
  get,
  isEmpty,
  isEqual, isEqualWith, merge, omit, pick, set,
} from 'lodash';
import classNames from 'classnames';
import { useDebounceFn } from 'ahooks';
import { transformFieldsToSearch } from './utils';
import QuestionSearchSelect from './SearchSelect';

import './index.less';
import { useWorkBenchStore } from '../../stores';

export const questionSearchFields = [
  {
    code: 'contents',
    name: '概要',
    display: true,
  },
  {
    code: 'issueType',
    name: '问题类型',
    // renderType:'',
    type: 'multiple',
    selectConfig: {
      paging: false,
      data: [{ meaning: '故事', value: 'story' },
        { meaning: '缺陷', value: 'bug' },
        { meaning: '任务', value: 'task' },
        { meaning: '子任务', value: 'sub_task' },
        // { meaning: '缺陷', value: 'bug' },
      ],
      readAxiosConfig: {

      },
    },
    display: false,
  },
  {
    code: 'status',
    name: '状态',
    selectConfig: {
      paging: true,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/agile/v1/organizations/${organizationId}/work_bench/status`,
        method: 'post',
        data: {},
      }),
      valueField: 'id',
      textField: 'name',
    },
    display: false,
  },
  {
    code: 'backlogStatus', // 需求状态
    source: 'backlog',
    name: '状态',
    selectConfig: {
      paging: true,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/agile/v1/organizations/${organizationId}/backlog/statistics/status`,
        method: 'get',
        params: { apply_type: 'backlog' },
      }),
      valueField: 'id',
      textField: 'name',
    },
    display: false,
  },
  {
    code: 'testStatus', // 测试状态
    source: 'test',
    name: '状态',
    selectConfig: {
      paging: true,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/test/v1/organizations/${organizationId}/test_work_bench/personal/my_execution_case/status/query`,
        method: 'post',
      }),
      filterParamName: 'param',
      valueField: 'statusId',
      textField: 'statusName',
    },
    display: false,
  },
  {
    code: 'priority', // 敏捷优先级
    name: '优先级',
    selectConfig: {
      paging: false,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/agile/v1/organizations/${organizationId}/work_bench/priority`,
        method: 'post',
        params: { param: '' },
        data: {},
      }),
      valueField: 'id',
      textField: 'name',
    },
    display: false,
  },
  {
    code: 'testPriority', // 测试优先级
    source: 'test',
    name: '优先级',
    selectConfig: {
      paging: false,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/test/v1/organizations/${organizationId}/test_priority`,
        method: 'get',
      }),
      valueField: 'id',
      textField: 'name',
    },
    display: false,
  },
  {
    code: 'backlogPriority', // 需求优先级
    source: 'backlog',
    name: '紧急程度',
    selectConfig: {
      paging: false,
      readAxiosConfig: ({ organizationId }) => ({
        url: '/agile/v1/backlog_external/priority/list',
        method: 'post',
        params: { organizationId },
      }),
      valueField: 'id',
      textField: 'name',
    },
    display: false,
  },
  {
    code: 'handler',
    source: 'backlog',
    name: '处理人',
    selectConfig: {
      paging: true,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/agile/v1/organizations/${organizationId}/backlog/work_bench/users`,
        method: 'get',
      }),
      valueField: 'id',
      textField: 'realName',
    },
    display: false,
  },
  {
    code: 'assignee',
    name: '经办人',
    selectConfig: {
      paging: true,
      readAxiosConfig: ({ organizationId }) => ({
        url: `/agile/v1/organizations/${organizationId}/work_bench/users`,
        method: 'post',
        data: {},
      }),
      valueField: 'id',
      textField: 'realName',
    },
    display: false,
  },
];
function useClickOut(onClickOut) {
  const ref = useRef();
  const handleClick = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      onClickOut(e);
    }
  }, [onClickOut]);
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);
  return ref;
}

const QuestionSearch = observer(({ fields = questionSearchFields, onQuery }) => {
  const prefixCls = 'c7ncd-question-search';
  const needRenderFields = useMemo(() => fields.filter((i) => i.display), [fields]);
  const hiddenFields = useMemo(() => fields.filter((i) => !i.display), [fields]);
  const [searchData, setSearchData] = useState(undefined);
  const { selectedProjectId } = useWorkBenchStore();

  const searchMode = useMemo(() => {
    const codes = fields.map((i) => i.source).filter(Boolean);
    if (codes.includes('backlog')) {
      return 'backlog';
    }
    return codes.includes('test') ? 'test' : 'agile';
  }, [fields]);
  const searchDs = useMemo(() => new DataSet({
    autoCreate: true,
    dataToJSON: 'normal',
    fields: fields.map((i) => ({
      name: i.code,
      label: i.name,
    })),
  }), [fields]);
  const [hidden, setHidden] = useState(true);
  const { run: handleQuery, cancel: handleCancelQuery } = useDebounceFn((data) => {
    const currentSearchData = data || searchDs.toJSONData()[0];
    const temp = transformFieldsToSearch(currentSearchData, searchMode);
    temp && onQuery && onQuery(temp);
  }, { wait: 320 });
  const handleChange = (code, v) => {
    searchDs.current.set(code, v);
    setSearchData((oldValue) => {
      const temp = set(cloneDeep(oldValue || {}), code, v);
      if (!oldValue || !isEqualWith(oldValue, temp, (a, b) => (isEmpty(a) && isEmpty(b) ? true : undefined))) {
        handleQuery(merge(searchDs.toJSONData()[0], temp));

        return temp;
      }

      return oldValue;
    });
  };

  useEffect(() => {
    if (searchData) {
      searchDs.setState('status', Object.values(omit(searchData, 'contents')).some((item) => !!item));
      handleQuery();
    }
  }, [handleQuery, searchData, searchDs, selectedProjectId]);

  const { run: handleInputContent } = useDebounceFn((v) => {
    handleChange('contents', v);
  }, { wait: 400 });

  const handleClear = () => {
    searchDs.current.clear();
    setSearchData(undefined);
    searchDs.setState('status', undefined);
    handleCancelQuery();
    handleQuery();
    // handleQuery();
  };
  const handleClickOut = useCallback(() => {
    setHidden(true);
  }, []);
  const containerRef = useClickOut(handleClickOut);
  return (
    <div className={prefixCls}>

      <Dropdown
        hidden={hidden}
        overlay={(
          <div
            ref={containerRef}
            role="none"
            onMouseDown={(e) => e.stopPropagation()}
            className={`${prefixCls}-menu`}
          >
            <Form dataSet={searchDs}>
              {hiddenFields.map((item) => (
                <QuestionSearchSelect
                  name={item.code}
                  multiple
                  onChange={(v) => setSearchData((oldData) => ({ ...(oldData || {}), [item.code]: v }))}
                  getPopupContainer={(node) => node.parentElement}
                  {...item.selectConfig}
                />
              ))}
            </Form>
            <div className={`${prefixCls}-menu-bottom`}>
              <Button
                color="primary"
                onClick={() => {
                  searchDs.setState('status', 'search');
                  handleQuery();
                  setHidden(true);
                }}
                style={{ marginLeft: '.1rem' }}
              >
                查询
              </Button>
              <Button onClick={handleClear}>重置</Button>
            </div>
          </div>
        )}
        trigger={['click']}
      >

        <Button
          icon="filter2"
          className={classNames(`${prefixCls}-search-btn`, { [`${prefixCls}-search-btn-active`]: searchDs.current.dirty && searchDs.getState('status') })}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            setHidden((old) => !old);
          }}
        />
      </Dropdown>
      <TextField
        record={searchDs.current}
        className={`${prefixCls}-summary`}
        prefix={<Icon type="search" />}
        onInput={(e) => handleInputContent(e.target.value)}
        placeholder="请输入搜索内容"
        clearButton
        onChange={(v) => handleChange('contents', v)}
      />
    </div>
  );
});

export default QuestionSearch;
