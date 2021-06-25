import React, {
  useEffect,
  useCallback, useMemo, useRef, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, TextField, Button, Dropdown, Form, Select, DataSet,
} from 'choerodon-ui/pro';
import { debounce, isEqual } from 'lodash';
import { useDebounce, useDebounceFn, usePersistFn } from 'ahooks';
import { transformFieldsToSearch } from './utils';
import QuestionSearchSelect from './SearchSelect';

import './index.less';

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
        method: 'get',
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
        url: `/agile/v1/organizations/${organizationId}/priority`,
        method: 'get',
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
    name: '优先级',
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
        method: 'get',
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
  const [value, setValue] = useState(undefined);
  const [searchData, setSearchData] = useState(undefined);
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
  const handleQuery = (data) => {
    const currentSearchData = data || searchDs.toJSONData()[0];
    onQuery && onQuery(transformFieldsToSearch(currentSearchData, searchMode));
  };
  const handleChange = (code, v) => {
    const currentValue = searchDs.current.get(code);
    if (!isEqual(currentValue, v)) {
      searchDs.current.set(code, v);
      setSearchData((oldValue) => {
        const temp = searchDs.toJSONData()[0];
        if (!isEqual(oldValue, temp)) {
          handleQuery(temp);
          return temp;
        }
        return oldValue;
      });
      // handleQuery();
    }
  };
  useEffect(() => {
    console.log('searchData....', searchData);
    // onQuery && onQuery(transformFieldsToSearch(searchData, searchMode));
  }, [searchData, searchMode]);
  const { run: handleInputContent } = useDebounceFn((v) => {
    handleChange('contents', v);
  }, { wait: 400 });

  const handleClear = () => {
    searchDs.current.clear();
    setValue(undefined);
    setSearchData(undefined);
    handleQuery();
    // handleQuery();
  };
  const handleClickOut = useCallback(() => {
    setHidden(true);
  }, []);
  const containerRef = useClickOut(handleClickOut);

  return (
    <div className={prefixCls}>
      <TextField
        className={`${prefixCls}-summary`}
        prefix={<Icon type="search" />}
        value={value}
        onInput={(e) => setValue(e.target.value) || handleInputContent(e.target.value)}
        placeholder="请输入搜索内容"
        clearButton
        onChange={(v) => handleChange('contents', v)}
      />
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
                  getPopupContainer={(node) => node.parentElement}
                  {...item.selectConfig}
                />
              ))}
            </Form>
            <div className={`${prefixCls}-menu-bottom`}>
              <Button color="primary" onClick={() => handleQuery()} style={{ marginLeft: '.1rem' }}>查询</Button>
              <Button onClick={handleClear}>重置</Button>
            </div>
          </div>
        )}
        trigger={['click']}
      >

        <Button
          icon="filter2"
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            setHidden((old) => !old);
          }}
        />
      </Dropdown>
    </div>
  );
});

export default QuestionSearch;
