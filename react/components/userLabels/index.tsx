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
    className: string
    labelContainerWidth :number
    agile: boolean
}

// @ts-ignore
const Index:React.FC<Iprops> = (props) => {
  const {
    list, labelContainerWidth, className, agile,
  } = props;

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

  const numTag = (maxTagNum:number) => {
    let str = '';
    list.forEach((i:string) => {
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
          {list.length - maxTagNum + 1}
          ...
        </Tag>
      </Tooltip>
    );
  };

  const getContent = () => {
    const containerWidth = labelContainerWidth || 100;
    let totalWidth = 0;
    let maxTagNum = 0;

    if (list[0] && 8 + list[0].length * 12 > containerWidth) {
      return numTag(1);
    }

    list.forEach((item, index) => {
      totalWidth += 8 + item.length * 12; // 12 按汉字算
      const nextItem = list[index + 1];

      if (nextItem) {
        if (totalWidth + 6 + 40 > containerWidth) { // 40 超出...tag宽度
          maxTagNum = index + 1;
          return;
        }
        const nextTotalWidth = totalWidth + 6 + 8 + nextItem.length * 12;
        if (nextTotalWidth > containerWidth) {
          maxTagNum = index + 2;
          return;
        }
        totalWidth += 6;
      }
    });
    if (totalWidth <= containerWidth) {
      maxTagNum = list.length;
    }
    return (
      <div className="c7ncd-userLabels-content" style={{ width: labelContainerWidth || 100 }}>
        {list.map((item, index) => getTag(item, index, maxTagNum))}
      </div>
    );
  };

  const getTag = (item:string, index:number, maxTagNum:number) => {
    if (index + 1 < maxTagNum) {
      const ele = (
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
      return ele;
    }
    if (index + 1 === maxTagNum) {
      return numTag(maxTagNum);
    }
    return '';
  };

  return (
    list.length
      ? (
        <div className={`c7ncd-userLabels ${className || ''} ${agile ? 'c7ncd-userLabels-agile' : ''}`}>
          {
            getContent()
          }
        </div>
      )
      : ''
  );
};

export default Index;
