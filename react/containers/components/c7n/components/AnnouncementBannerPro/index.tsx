import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import map from 'lodash/map';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
// import { useIntervalTrigger } from '@zknow/components';
import './index.less';
import { Icon } from 'choerodon-ui/pro';
import useIntervalTrigger from '@/hooks/useIntervalTrigger';

const prefixCls = 'c7ncd-banner';

const AnnouncementBannerPro = inject('HeaderStore')(observer((props:any) => {
  const {
    HeaderStore,
  } = props;

  const [index, setIndex] = useState<number>(0);

  const initState = useCallback(() => {
    const announcementLists = [...HeaderStore.getAnnouncementLists];
    const announcementSize = announcementLists.length;
    if (announcementSize && announcementSize >= 2) {
      const temp = announcementLists;
      temp.push(temp[0]);
      return temp;
    }
    if (announcementSize === 1) {
      return announcementLists;
    }
    return [];
  }, [HeaderStore.getAnnouncementLists.size]);

  const [lists, setLists] = useState<any>(initState);

  useEffect(() => {
    const current = initState();
    setLists(current);
  }, [initState]);

  const listRef = useRef<HTMLDivElement>(null);

  const listLength = lists.length;

  const [start, clear] = useIntervalTrigger(startSlide, 3000, {
    autoStart: false,
  });

  function startSlide() {
    if (!listRef || !listRef.current) return;
    const { height } = listRef.current.getBoundingClientRect();
    const translateYItem = Math.floor(height / (listLength));
    const nextIndex = index + 1;

    listRef.current.style.transform = `translateY(-${
      translateYItem * nextIndex
    }px)`;

    listRef.current.style.transition = 'transform 1s';
    if (index >= listLength - 2) {
      // 最后一个
      setTimeout(() => {
        setIndex(0);
        if (listRef.current) {
          listRef.current.style.transform = 'translateY(0)';
          listRef.current.style.transition = 'transform 0s';
        }
      }, 1000);
    } else {
      setIndex(nextIndex);
    }
  }

  const reset = () => {
    clear();
    if (listRef.current) {
      listRef.current.style.transform = 'translateY(0)';
      listRef.current.style.transition = 'transform 0s';
    }
  };

  useEffect(() => {
    reset();
    if (listLength > 1) {
      start();
    }
  }, [listLength]);

  const renderLists = () => (
    map(lists, ([key, item], i) => {
      const {
        component,
        onCloseCallback,
      } = item;

      return (
        <div className={`${prefixCls}-item`}>
          <div className={`${prefixCls}-item-content`}>
            {component}
          </div>
          <Icon
            className={`${prefixCls}-item-close`}
            type="close"
            onClick={() => {
              HeaderStore.deleteAnnouncement(key);
              typeof onCloseCallback === 'function' && onCloseCallback();
            }}
          />
        </div>
      );
    })

  );

  if (!listLength) {
    return null;
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-wrapper`}>
        <div className={`${prefixCls}-content`} ref={listRef}>
          {renderLists()}
        </div>
      </div>
    </div>
  );
}));

export default AnnouncementBannerPro;
