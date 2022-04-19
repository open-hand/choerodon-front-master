import React, { } from 'react';
import { Tag } from 'choerodon-ui';
// @ts-ignore
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import {
  Tooltip,
} from 'choerodon-ui/pro';
import './index.less';

export interface Iprops {
    list: Array<string>
}

// @ts-ignore
const Index:React.FC<Iprops> = (props) => {
  const { list } = props;

  const handleMouseEnter = (e:any, title:string) => {
    const { currentTarget } = e;
    if (isOverflow(currentTarget)) {
      // @ts-ignore
      Tooltip.show(currentTarget, {
        title,
        placement: 'top',
      });
    }
  };

  const handleMouseLeave = () => {
    // @ts-ignore
    Tooltip.hide();
  };

  const getTag = (item:string, index:number, labelList: Array<string>) => {
    if (index <= 1) {
      return (
        <Tag
        // @ts-ignore
          onMouseEnter={(e) => { handleMouseEnter(e, item); }}
          onMouseLeave={handleMouseLeave}
          style={{
            color: '#4D90FE',
            position: 'relative',
            marginRight: 2,
          }}
          color="#E6F7FF"
        >
          {item}
        </Tag>
      );
    }
    if (index === 2) {
      let str = '';
      labelList.forEach((i:string) => {
        str = `${str + i} ,`;
      });
      str = str.substring(0, str.length - 1);
      return (
        <Tooltip title={str}>
          <Tag
            style={{
              color: '#4D90FE',
              position: 'relative',
              marginRight: 2,
            }}
            color="#E6F7FF"
          >
            +
            {labelList.length - 2}
            ...
          </Tag>
        </Tooltip>
      );
    }
    return '';
  };

  return (
    <div className="c7ncd-userLabels">
      {list.map((item, index) => getTag(item, index, list))}
    </div>
  );
};

export default Index;
