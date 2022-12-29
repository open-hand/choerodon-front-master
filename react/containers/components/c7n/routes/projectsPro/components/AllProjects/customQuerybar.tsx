/* eslint-disable react/require-default-props */
import React, {
  useEffect, useMemo, useRef, useState, useImperativeHandle,
} from 'react';
import { FlatSelect, FlatTreeSelect } from '@choerodon/components';
import {
  Button, TextField, Icon, DataSet, Tooltip, Modal, DateTimePicker, Select,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  cloneDeep, forIn, isNil, omit, remove,
} from 'lodash';
import { observer } from 'mobx-react-lite';
import ChooseFieldsBtn, { ICheckBoxFields } from './chooseFieldsBtn';
import './customQuerybar.less';

const modalKey1 = Modal.key();

export interface ICustomBtnConfig {
  ele: React.ReactNode
}
// TODO: usereducer
export interface IProps {
  searchFieldsConfig: ISearchFields[]
  filterFieldsConfig: ICheckBoxFields[]
  customButtonsConfig?: ICustomBtnConfig[]
  onChange: (name: string, value: any) => void
  cRef?: any
  showResetButton?: boolean
}

export interface ISearchFields {
  name: string
  type: string,
  fieldProps: any
  width?: number
  initial: boolean
  optionQueryConfig?: any
  optionsTextField?: string
  optionsValueField?: string
  optionConfig?: any
  cRef?: any
}

const fieldsMap = new Map(
  [
    ['TextField', TextField],
    ['FlatSelect', FlatSelect],
    ['Select', Select],
    ['FlatTreeSelect', FlatTreeSelect],
    ['DateTimePicker', DateTimePicker],
  ],
);

const Index: React.FC<IProps> = (props) => {
  const {
    searchFieldsConfig, filterFieldsConfig, customButtonsConfig, onChange, cRef, showResetButton = true,
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
        dsFieldAdd(item.name, item.forAShortTimeDsProps || {});
      } else {
        dsOptionFieldAdd(item.name, item.optionsTextField || 'name', item.optionsValueField || 'id',
          item.optionConfig || {}, item.optionQueryConfig);
      }
    });
    setInitialFieldNum(getInitialFieldNum(searchFieldsConfig));
  }, []);

  // {
  //   name: 'createdBys',
  //   textField: 'realName',
  //   valueField: 'id',
  //   multiple: true,
  //   searchable: true,
  //   options: new DataSet({
  //     autoCreate: true,
  //     autoQuery: true,
  //     clearButton: true,
  //     searchable: true,
  //     transport: {
  //       read({ dataSet, record, params: { page } }) {
  //         return {
  //           url: 'http://api.devops.hand-china.com/iam/choerodon/v1/organizations/1419/users/search',
  //           method: 'get',
  //         };
  //       },
  //     },
  //   }),
  // }
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
    const num = height / 42;
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

  const dsFieldAdd = (name: string, forAShortTimeDsObj:any) => {
    if (!compDataSet.getField(name)) {
      compDataSet.addField(name, forAShortTimeDsObj);
    }
  };

  const dsOptionFieldAdd = (name: string, textField: string | undefined, valueField: string | undefined, optionConfig: any, optionQueryConfig: any) => {
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
    childRef.current.checkChange(false, name);
  };

  const handleRemoteSearch = async (e: any, item: ISearchFields) => {
    const { value } = e.target;
    if (item.fieldProps.remoteSearch) {
      const optionDs = compDataSet?.getField(item.name)?.options;
      if (optionDs) {
        optionDs.setQueryParameter(item.fieldProps.remoteSearchName || 'param', value);
      }
      await optionDs?.query();
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
        // @ts-ignore
        dsFieldAdd(i.name, i.forAShortTimeDsProps || {});
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

  // const test = (e: any) => {
  //   const aa = compDataSet?.getField('createdBys')?.options;
  //   aa.setQueryParameter('params', e.target.value);
  //   aa?.query();
  // };

  return (
    <>
      <div className="searchField-container">
        <div className="searchField-container-left">
          <div className="searchField-item">
            <TextField prefix={<Icon type="search" />} placeholder="请输入搜索内容" dataSet={compDataSet} name="searchContent" />
            {/* <Select searchable dataSet={compDataSet} name="createdBys" onInput={(e) => { test(e); }} /> */}
          </div>
          <div className="searchField-container-left-block1">
            <div className="searchField-container-left-block1-inner">
              {
                searchFields.map((item, index) => getSearchField(item, index))
              }
              {
                filterFieldsConfig.length > 0 ? (
                  <div className="searchField-item">
                    <ChooseFieldsBtn
                      fields={filterFieldsConfig}
                      onChange={chooseFieldsChange}
                      cRef={childRef}
                      reset={handleReset}
                    />
                  </div>
                ) : ''
              }
              {
               customButtonsConfig && customButtonsConfig.map((item) => (
                 <div className="searchField-item">
                   {item.ele}
                 </div>
               ))
              }
            </div>
          </div>
          <div className="searchField-container-left-block2">
            {
              (searchFields.length > initialFieldNum || getIfValue())
              && showResetButton && (
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
      </div>
    </>
  );
};

export default observer(Index);
