/* eslint-disable no-param-reassign */
import {
  Button, CheckBox, Dropdown, Icon, TextField, DataSet,
} from 'choerodon-ui/pro';
import React, { useState, useImperativeHandle } from 'react';
import { useSafeState, useClickAway } from 'ahooks';

export interface IProps {
  dataSet: DataSet
  cRef:any
}

export interface ICheckBoxFields {
  name: string
  label: string
}

const Index: React.FC<IProps> = (props) => {
  const {
    dataSet, cRef,
  } = props;

  const [hidden, setHidden] = useSafeState(true);
  const [searchValue, setSearchValue] = useState('');
  // const [indeterminate, setindeterminate] = useState(false);
  const [checkedAll, setcheckedAll] = useState(false);

  useImperativeHandle(cRef, () => ({
    reset: cleanAll,
  }));

  const getFields = () => [...dataSet?.fields].map((arr) => {
    const fieldName = arr[0];
    const state = dataSet?.getState(fieldName);
    if (!state) {
      return <span />;
    }
    const {
      visible, label,
    } = state;
    return visible ? (
      <div className="c7n-agile-choose-field-list-item">
        <CheckBox name={fieldName} dataSet={dataSet}>
          {label}
        </CheckBox>
      </div>
    ) : '';
  });

  const handleAllChange = (value: boolean) => {
    const record = dataSet?.current;
    [...dataSet?.fields].map((arr) => {
      const fieldName = arr[0];
      const state = dataSet?.getState(fieldName);
      if (state.visible) {
        record?.set(fieldName, value);
      }
    });
    setcheckedAll(value);
  };

  const cleanAll = () => {
    const record = dataSet?.current;
    [...dataSet?.fields].map((arr) => {
      const fieldName = arr[0];
      const state = dataSet?.getState(fieldName);
      record?.set(fieldName, false);
      dataSet.setState(fieldName, {
        ...state,
        visible: true,
      });
    });
    setcheckedAll(false);
    setSearchValue('');
    setHidden(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    let visibleNum = 0;
    let checkedNum = 0;
    const record = dataSet?.current;

    [...dataSet?.fields].map((arr) => {
      const fieldName = arr[0];
      const state = dataSet?.getState(fieldName);
      if (!value) {
        dataSet?.setState(fieldName, {
          ...state,
          visible: true,
        });
        visibleNum += 1;
      } else if (state.label.indexOf(value) !== -1) {
        dataSet?.setState(fieldName, {
          ...state,
          visible: true,
        });
        visibleNum += 1;
      } else {
        dataSet?.setState(fieldName, {
          ...state,
          visible: false,
        });
      }

      if (record?.get(fieldName)) {
        checkedNum += 1;
      }
    });
    setcheckedAll(visibleNum > 0 && (visibleNum === checkedNum));
  };

  const dropdownContent = () => (
    <div
      className="c7n-agile-choose-field-list"
      role="none"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="c7n-agile-choose-field-list-search">
        <TextField prefix={<Icon type="search" />} placeholder="请输入搜索内容" clearButton onChange={handleSearchChange} value={searchValue} />
      </div>
      <div className="c7n-agile-choose-field-list-header">
        {/* indeterminate={indeterminate} */}
        <CheckBox checked={checkedAll} onChange={handleAllChange}>全选</CheckBox>
        <Button onClick={cleanAll}>清除筛选项</Button>
      </div>
      <div className="c7n-agile-choose-field-list-content">
        <div className="c7n-agile-choose-field-list-section">
          <div className="c7n-agile-choose-field-list-title">预定义字段</div>
          <div className="c7n-agile-choose-field-list-list">
            {
              getFields()
            }
          </div>
        </div>
      </div>
    </div>
  );

  const overlay = (
    <div
      role="none"
      id="c7ncd-customQueryBarFilter-overlay"
    >
      {dropdownContent()}
    </div>
  );

  useClickAway(() => { setHidden(true); }, () => document.getElementById('c7ncd-customQueryBarFilter-overlay'));

  return (
    <div>
      <Dropdown
        hidden={hidden}
        overlay={overlay}
        trigger={'click' as any}
        // @ts-ignore
        getPopupContainer={() => document.getElementById('c7ncd-customQueryBarFilter-btn')}
      >
        <Button id="c7ncd-customQueryBarFilter-btn">
          <div
            style={{
              display: 'flex', alignItems: 'center', fontWeight: 500, height: '100%', padding: '0 12px',
            }}
            role="none"
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              e.stopPropagation();
              setHidden(false);
            }}
          >
            添加筛选
            <Icon type="arrow_drop_down" />
          </div>
        </Button>
      </Dropdown>
    </div>
  );
};

export default Index;
