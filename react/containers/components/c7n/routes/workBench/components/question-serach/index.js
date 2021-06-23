import React, {
  useEffect,
  useCallback, useMemo, useRef, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, TextField, Button, Dropdown, Form, Select, DataSet,
} from 'choerodon-ui/pro';
import { debounce } from 'lodash';
import './index.less';

const systemFields = [
  {
    code: 'contents',
    name: '概要',
    display: true,
  },
  {
    code: 'issueType',
    name: '问题类型',
    // renderType:'',
    display: false,
  },
  {
    code: 'status',
    name: '状态',
    display: false,
  },
  {
    code: 'priority',
    name: '优先级',
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

const QuestionSearch = observer(({ fields = systemFields, onQuery }) => {
  const prefixCls = 'c7ncd-question-search';
  const needRenderFields = useMemo(() => fields.filter((i) => i.display), [fields]);
  const hiddenFields = useMemo(() => fields.filter((i) => !i.display), [fields]);
  const searchDs = useMemo(() => new DataSet({
    autoCreate: true,
    fields: fields.map((i) => ({ name: i.code, label: i.name })),
  }), [fields]);
  const [hidden, setHidden] = useState(true);
  const handleQuery = () => {
    let searchData = {};
    if (searchDs.current.dirty) {
      searchData = searchDs.current.toJSONData();
    }
    onQuery && onQuery(searchData);
  };
  const handleChange = (code, value) => {
    searchDs.current.set(code, value);
    handleQuery();
  };
  const handleInputContent = debounce((value) => {
    handleChange('contents', value);
  }, 400);
  const handleClear = () => {
    searchDs.current.clear();
    handleQuery();
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
        onInput={(e) => handleInputContent(e.target.value)}
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
              {hiddenFields.map((item) => <Select name={item.code} />)}
            </Form>
            <div className={`${prefixCls}-menu-bottom`}>
              <Button color="primary" onClick={handleQuery} style={{ marginLeft: '.1rem' }}>查询</Button>
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
