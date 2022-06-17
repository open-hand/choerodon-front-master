/* eslint-disable no-param-reassign */
import {
  Button, CheckBox, Dropdown, Icon, TextField,
} from 'choerodon-ui/pro';
import { cloneDeep } from 'lodash';
import React, {
  useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import {
  usePersistFn, useSafeState, useInViewport,
} from 'ahooks';
import { ISearchFields } from './a';

export interface IProps {
  fields: Array<ICheckBoxFields>
  onChange: (value: boolean, changeArr:ICheckBoxFields[])=> void
  cRef: any
  reset: ()=>void
}

export interface ICheckBoxFields extends ISearchFields{
  show: boolean
  checked: boolean
  checkboxLabel: string
}

const Index:React.FC<IProps> = (props) => {
  const {
    onChange, fields, cRef, reset,
  } = props;
  const [hidden, setHidden] = useSafeState(true);
  const [searchValue, setSearchValue] = useState('');
  const [indeterminate, setindeterminate] = useState(false);
  const [checked, setchecked] = useState(false);
  const [checkBoxFields, setCheckBoxFields] = useState<ICheckBoxFields[] | []>([]);

  useImperativeHandle(cRef, () => ({
    checkChange: (value:boolean, index:number) => {
      const cloneArr = cloneDeep(checkBoxFields);
      cloneArr[index].checked = value;
      initCheckboxAll(cloneArr);
      setCheckBoxFields(cloneArr);
    },
  }));

  function useClickOut(onClickOut: (e?: any) => void) {
    const tref = useRef<HTMLDivElement | null>(null);
    const handleClick = useCallback((e) => {
      if (tref.current && !tref.current.contains(e.target)) {
        onClickOut(e);
      }
    }, [onClickOut]);
    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }, [handleClick]);
    return tref;
  }

  const handleClickOut = usePersistFn(() => {
    setHidden(true);
  });

  const initCheckboxAll = (arr:ICheckBoxFields[]) => {
    if (arr.every((i) => i.checked)) {
      setchecked(true);
    }
    if (arr.some((i) => i.checked) && !arr.every((i) => i.checked)) {
      setindeterminate(true);
    }
  };

  useEffect(() => {
    const cloneArr = cloneDeep(fields);
    cloneArr.forEach((item) => {
      item.show = true;
    });
    setCheckBoxFields(cloneArr);

    initCheckboxAll(fields);
  }, []);

  const handleAllChange = (value: boolean) => {
    const cloneCheckBoxFields = cloneDeep(checkBoxFields);

    function reduceDuplication(bool:boolean) {
      cloneCheckBoxFields.forEach((item:any) => {
        if (bool ? !item.checked : item.checked) {
          changeArr.push(item);
        }
      });
    }

    function reduceDuplication2(bool:boolean) {
      cloneCheckBoxFields.forEach((item:any) => {
        item.checked = bool;
      });
    }

    const changeArr:any = [];
    if (value) {
      reduceDuplication(true);
    } else {
      reduceDuplication(false);
    }
    onChange(value, changeArr);

    if (indeterminate) {
      setindeterminate(false);
    }
    setchecked(value);
    reduceDuplication2(value);
    setCheckBoxFields(cloneCheckBoxFields);
  };

  const cleanAll = () => {
    reset();
    setindeterminate(false);
    setchecked(false);
    const cloneCheckBoxFields = cloneDeep(checkBoxFields);
    cloneCheckBoxFields.forEach((item:any) => {
      item.checked = false;
      item.show = true;
    });
    setCheckBoxFields(cloneCheckBoxFields);
    setSearchValue('');
    setHidden(true);
  };

  const handleChooseFieldChange = (value: boolean, item: ICheckBoxFields, index:number) => {
    const cloneCheckBoxFields = cloneDeep(checkBoxFields);
    cloneCheckBoxFields[index].checked = value;
    setCheckBoxFields(cloneCheckBoxFields);
    onChange(value, [item]);
  };

  const handleSearchChange = (value:string) => {
    setSearchValue(value);
    const cloneArr = cloneDeep(checkBoxFields);
    if (!value) {
      cloneArr.forEach((item) => {
        item.show = true;
      });
    } else {
      cloneArr.forEach((item) => {
        if (item.checkboxLabel.indexOf(value) !== -1) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
    }
    setCheckBoxFields(cloneArr);
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
        <CheckBox indeterminate={indeterminate} checked={checked} onChange={handleAllChange}>全选</CheckBox>
        <Button onClick={cleanAll}>清除筛选项</Button>
      </div>
      <div className="c7n-agile-choose-field-list-content">
        <div className="c7n-agile-choose-field-list-section">
          <div className="c7n-agile-choose-field-list-title">预定义字段</div>
          <div className="c7n-agile-choose-field-list-list">
            {
                                checkBoxFields.map((item:ICheckBoxFields, index:number) => (item.show ? (
                                  <div className="c7n-agile-choose-field-list-item">
                                    <CheckBox
                                      onChange={(value: boolean) => { handleChooseFieldChange(value, item, index); }}
                                      checked={item.checked}
                                    >
                                      {item.checkboxLabel}
                                    </CheckBox>
                                  </div>
                                ) : ''))
            }
          </div>
        </div>
      </div>
    </div>
  );

  const buttonRef = useRef<HTMLDivElement>(null);
  const ref = useClickOut(handleClickOut);
  const inViewPort = useInViewport(buttonRef);
  useEffect(() => {
    !inViewPort && setHidden(true);
  }, [inViewPort, setHidden]);
  return (
    <div ref={buttonRef}>
      <Dropdown
        hidden={hidden}
        overlay={(
          <div
            role="none"
            ref={ref}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {dropdownContent()}
          </div>
    )}
        trigger={'click' as any}
      >
        <Button>
          <span
            style={{
              display: 'flex', alignItems: 'center', fontWeight: 500,
            }}
            role="none"
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              setHidden(false);
            }}
          >
            添加筛选
            <Icon type="arrow_drop_down" />
          </span>
        </Button>
      </Dropdown>
    </div>
  );
};

export default Index;
