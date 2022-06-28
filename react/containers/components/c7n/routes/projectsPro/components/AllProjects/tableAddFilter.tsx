import React, {
  useEffect, useMemo, useRef, useState, useImperativeHandle,
} from 'react';
import { FlatSelect } from '@choerodon/components';
import {
  Button, TextField, Icon, DataSet, Tooltip, Modal, DateTimePicker, TreeSelect,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  cloneDeep, forIn, isNil, omit, remove,
} from 'lodash';
import { observer } from 'mobx-react-lite';
import ChooseFieldsBtn, { ICheckBoxFields } from './chooseFieldsBtn';
import TableColumnSet from './tableColumnSet';
import './tableAddFilter.less';

const modalKey1 = Modal.key();

export interface IProps {
  searchFieldsConfig: ISearchFields[]
  filterFieldsConfig: ICheckBoxFields[]
  onChange: (name: string, value: any) => void
  cRef: any
}

export interface ISearchFields {
  name: string
  type: string,
  fieldProps: any
  width?: number
  initial: boolean
  optionQueryConfig?: () => void
  optionsTextField?: string
  optionsValueField?: string
  optionConfig?: any
  cRef?: any
}

const fieldsMap = new Map(
  [
    ['TextField', TextField],
    ['Select', FlatSelect],
    ['TreeSelect', TreeSelect],
    ['DateTimePicker', DateTimePicker],
  ],
);

const Index: React.FC<IProps> = (props) => {
  const {
    searchFieldsConfig, filterFieldsConfig, onChange, cRef,
  } = props;
  const [initialFieldNum, setInitialFieldNum] = useState<number>(0);
  const [expandBtnVisible, setExpandBtnVisible] = useState<boolean>(false);
  const [expandBtnType, setExpandBtnType] = useState<'expand_less' | 'expand_more'>('expand_less');
  const [searchFields, setSearchFields] = useState<ISearchFields[]>([]);
  const [searchFieldsOrigin, setSearchFieldsOrigin] = useState<ISearchFields[]>([]);

  const childRef = useRef<any>();

  useImperativeHandle(cRef, () => ({
    reset: handleReset,
  }));

  useEffect(() => {
    // 没有保存的数据的时候
    setSearchFields(searchFieldsConfig);
    setSearchFieldsOrigin(searchFieldsConfig);
    searchFieldsConfig.forEach((item: any) => {
      if (!item.optionQueryConfig) {
        dsFieldAdd(item.name);
      } else {
        dsOptionFieldAdd(item.name, item.optionsTextField || 'name', item.optionsValueField || 'id',
          item.optionConfig || {}, item.optionQueryConfig);
      }
    });
    setInitialFieldNum(getInitialFieldNum(searchFieldsConfig));
  }, []);

  const compDataSet = useMemo(() => {
    const ds = new DataSet({
      autoCreate: true,
      autoQuery: false,
      fields: [],
      events: {
        update: ({ record, name, value }: { record: Record, name: string, value: any }) => {
          onChange(name, value);
        },
      },
    });
    return ds;
  }, []);

  useEffect(() => {
    const ele = document.getElementsByClassName('searchField-container-left-block1-inner')[0];
    const height = +(window.getComputedStyle(ele).height.split('px')[0]);
    const num = height / 52;
    if (num > 1) {
      setExpandBtnVisible(true);
    } else {
      setExpandBtnVisible(false);
    }
  }, [searchFields]);

  const getInitialFieldNum = (arr: ISearchFields[]) => {
    let num = 0;
    arr.forEach((item) => {
      if (item.initial) {
        num += 1;
      }
    });
    return num;
  };

  const dsFieldAdd = (name: string) => {
    if (!compDataSet.getField(name)) {
      compDataSet.addField(name, {});
    }
  };

  const dsOptionFieldAdd = (name: string, textField: string | undefined, valueField: string | undefined, optionConfig:any, optionQueryConfig: any) => {
    if (!compDataSet.getField(name)) {
      compDataSet.addField(name, {
        textField,
        valueField,
        options: new DataSet({
          autoCreate: true,
          autoQuery: true,
          ...optionConfig,
          transport: {
            read({ dataSet, record, params: { page } }) {
              return {
                ...optionQueryConfig,
              };
            },
          },
        }),
      });
    }
  };

  const handleDeleteField = (index: number, name: string) => { // 外面X掉
    compDataSet?.current?.set(name, null);
    const cloneSearchFields = cloneDeep(searchFields);
    cloneSearchFields.splice(index, 1);
    setSearchFields(cloneSearchFields);
    childRef.current.checkChange(false, index - 2);
  };

  const handleRemoteSearch = (e: any, item: ISearchFields) => {
    const { value } = e.target;
    if (item.fieldProps.remoteSearch) {
      const optionDs = compDataSet?.getField(item.name)?.options;
      if (optionDs) {
        optionDs.setQueryParameter('param', value);
      }
      optionDs?.query();
    }
  };

  const getSearchField = (item: ISearchFields, index: number) => {
    const Ele = fieldsMap.get(item.type);
    return item.initial ? (
      <div className="searchField-item">
        {/*  @ts-ignore */}
        <Ele
          style={{ width: item.width || 'auto' }}
          {...item.fieldProps}
          dataSet={compDataSet}
          name={item.name}
          onInput={(e: string) => { handleRemoteSearch(e, item); }}
        />
      </div>
    ) : (
      <div className="searchField-item searchField-item-deletable">
        {/*  @ts-ignore */}
        <Ele
          style={{ width: item.width || 'auto' }}
          {...item.fieldProps}
          dataSet={compDataSet}
          name={item.name}
          onInput={(e: string) => { handleRemoteSearch(e, item); }}
        />
        <div
          className="deletable-div"
          role="none"
          onClick={() => {
            handleDeleteField(index, item.name);
          }}
        >
          <Icon type="close" />
        </div>
      </div>
    );
  };

  const fieldAdd = (changeArr: ICheckBoxFields[]) => {
    const cloneSearchFields = cloneDeep(searchFields);
    changeArr.forEach((i) => {
      { /*  @ts-ignore */ }
      cloneSearchFields.push(i);
      if (!i.optionQueryConfig) {
        dsFieldAdd(i.name);
      } else {
        dsOptionFieldAdd(i.name, i.optionsTextField || 'name', i.optionsValueField || 'id',
          i.optionConfig || {},
          i.optionQueryConfig);
      }
    });
    setSearchFields(cloneSearchFields);
  };

  const fieldRemove = (changeArr: ICheckBoxFields[]) => { // 里面checkbox 移除外面字段
    const cloneSearchFields = cloneDeep(searchFields);
    changeArr.forEach((item) => {
      compDataSet?.current?.set(item.name, null);
      remove(cloneSearchFields, (i) => item.name === i.name);
    });
    setSearchFields(cloneSearchFields);
  };

  const chooseFieldsChange = (value: boolean, changeArr: ICheckBoxFields[]) => {
    if (value) {
      fieldAdd(changeArr);
    } else {
      fieldRemove(changeArr);
    }
  };

  const handleReset = () => {
    setSearchFields(cloneDeep(searchFieldsOrigin));
    compDataSet.reset(); // 没有触发dataset update事件 手动触发一下
    onChange('reset', 'reset');
    childRef?.current?.init();
    setExpandBtnVisible(false);
    setExpandBtnType('expand_less');
  };

  const getIfValue = () => {
    const obj = omit(compDataSet?.current?.toData(), '__dirty');
    let bool = false;
    // eslint-disable-next-line consistent-return
    forIn(obj, (value, key) => {
      if (!isNil(value)) {
        bool = true;
        return false;
      }
    });
    return bool;
  };

  const handleExpandClick = () => {
    if (expandBtnType === 'expand_less') {
      document.getElementsByClassName('searchField-container-left-block1')[0].classList
        .add('searchField-container-left-block1-only1line');
      setExpandBtnType('expand_more');
      return;
    }
    document.getElementsByClassName('searchField-container-left-block1')[0].classList
      .remove('searchField-container-left-block1-only1line');
    setExpandBtnType('expand_less');
  };

  const openEditColumnModal = () => {
    Modal.open({
      key: modalKey1,
      title: '列表显示设置',
      drawer: true,
      style: {
        width: 380,
      },
      children: <TableColumnSet />,
      bodyStyle: {
        paddingTop: 10,
      },
    });
  };

  return (
    <>
      <div className="searchField-container">
        <div className="searchField-container-left">
          <div className="searchField-item">
            <TextField prefix={<Icon type="search" />} placeholder="请输入搜索内容" dataSet={compDataSet} name="searchContent" />
            {/* <TreeSelect dataSet={compDataSet} name="workGroupIds" /> */}
          </div>
          <div className="searchField-container-left-block1">
            <div className="searchField-container-left-block1-inner">
              {
                searchFields.map((item, index) => getSearchField(item, index))
              }
              <div className="searchField-item">
                <ChooseFieldsBtn
                  fields={filterFieldsConfig}
                  onChange={chooseFieldsChange}
                  cRef={childRef}
                  reset={handleReset}
                />
              </div>
            </div>
          </div>
          <div className="searchField-container-left-block2">
            {
              (searchFields.length > initialFieldNum || getIfValue())
              && (
                <>
                  <Button onClick={handleReset}>重置</Button>
                  <Tooltip title={expandBtnType === 'expand_less' ? '折叠筛选' : '展开筛选'}>
                    {expandBtnVisible && <Button icon={expandBtnType} onClick={handleExpandClick} />}
                  </Tooltip>
                </>
              )
            }
          </div>
        </div>
        <div className="searchField-container-right">
          <Button icon="view_column" onClick={openEditColumnModal} />
        </div>
      </div>
    </>
  );
};

export default observer(Index);
