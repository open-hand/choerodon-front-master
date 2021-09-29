import React, { useEffect } from 'react';
import map from 'lodash/map';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import './index.less';
import { Icon } from 'choerodon-ui/pro';

const prefixCls = 'c7ncd-banner';

const AnnouncementBannerPro = inject('HeaderStore')(observer((props:any) => {
  const {
    HeaderStore,
  } = props;

  const announcementLists = Object.fromEntries(HeaderStore.getAnnouncementLists);

  const renderLists = () => (
    map(announcementLists, (item, key) => {
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

  if (!HeaderStore.getAnnouncementLists.size) {
    return null;
  }

  return (
    <div className={prefixCls}>
      {renderLists()}
    </div>
  );
}));

export default AnnouncementBannerPro;
