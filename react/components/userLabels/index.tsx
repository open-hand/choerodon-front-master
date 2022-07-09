import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Tag } from 'choerodon-ui';
// @ts-ignore
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import ResizeObserver from 'resize-observer-polyfill';
import {
  Tooltip,
} from 'choerodon-ui/pro';
import './index.less';
import { get, throttle } from 'lodash';

let observeResize: any;

export interface Iprops {
  list: Array<string>
  className: string
  labelContainerWidth: number
  agile: boolean
  sizeObserver: boolean | undefined
}

// @ts-ignore
const Index: React.FC<Iprops> = (props) => {
  const {
    list, labelContainerWidth, className, agile, sizeObserver,
  } = props;

  const ref = useRef();

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (sizeObserver) {
      const domTem = ref?.current;
      if (domTem) {
        observeResize = new ResizeObserver((entries: any) => {
          const dom = get(entries[0], 'target');
          const width = get(dom, 'offsetWidth');
          throttlFn(width);
        });
        observeResize.observe(domTem);
      }
    } else {
      setContainerWidth(labelContainerWidth);
    }
  }, [list]);

  const throttlFn = useCallback(throttle((width) => { setContainerWidth(width); }, 300), []);

  useEffect(() => () => {
    if (observeResize) {
      observeResize.disconnect();
    }
  }, []);

  const handleMouseEnter = (e: any, title: string) => {
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

  const numTag = (maxTagNum: number) => {
    let str = '';
    list.forEach((i: string) => {
      str = `${str + i} ,`;
    });
    str = str.substring(0, str.length - 1);
    const copyList = JSON.parse(JSON.stringify(list));
    const toolList = copyList.reverse().slice(0, list.length - maxTagNum + 1).reverse();
    return (
      <Tooltip title={toolList.join(',')}>
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
    if (containerWidth < 40) {
      return '';
    }
    let totalWidth = 0;
    let maxTagNum = 0;

    if (list[0] && 8 + list[0].length * 12 > containerWidth) {
      return numTag(1);
    }

    let overflow = false;

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < list.length; index++) {
      totalWidth += 10 + list[index].length * 12; // 12 按汉字算
      const nextItem = list[index + 1];

      if (nextItem) {
        if (totalWidth + 6 + 40 > containerWidth) { // 40 超出...tag宽度
          maxTagNum = index + 1;
          overflow = true;
          break;
        }
        const nextTotalWidth = totalWidth + 6 + 10 + nextItem.length * 12;
        if (nextTotalWidth > containerWidth) {
          maxTagNum = index + 2;
          overflow = true;
          break;
        }
        totalWidth += 6;
      }
    }

    if (totalWidth <= containerWidth && !overflow) {
      maxTagNum = list.length;
    }
    return (
      <div className="c7ncd-userLabels-content">
        {list.map((item, index) => getTag(item, index, maxTagNum, overflow))}
      </div>
    );
  };

  const getTag = (item: string, index: number, maxTagNum: number, overflow: boolean) => {
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
    if (index + 1 < maxTagNum) {
      return ele;
    }
    if (index + 1 === maxTagNum) {
      if (overflow) {
        return numTag(maxTagNum);
      }
      return ele;
    }
    return '';
  };

  return (
    list.length
      ? (
        // @ts-ignore
        <div ref={ref} className={`c7ncd-userLabels ${className || ''} ${agile ? 'c7ncd-userLabels-agile' : ''}`}>
          {
            getContent()
          }
        </div>
      )
      : ''
  );
};

export default Index;
