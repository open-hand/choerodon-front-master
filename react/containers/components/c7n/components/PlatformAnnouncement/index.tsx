import React, { useEffect } from 'react';
import { Button, Icon } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import get from 'lodash/get';
import './index.less';
import axios from '../../tools/axios';

const prefixCls = 'c7ncd-platform-announcement';

const imgPartten = /<img(.*?)>/g;
const htmlTagParttrn = /<[^>]*>/g;

const modalStyle = {
  width: '8rem',
};

let infoModal:any;
const infoModalKey = Modal.key();

function axiosGetNewSticky() {
  return axios({
    method: 'get',
    url: '/hmsg/choerodon/v1/system_notice/new_sticky',
  });
}

export {
  axiosGetNewSticky,
};

const PlatformAnnouncement = (props:{
  data:{
    content: string,
    title:string
    id:string
  },
  onCloseCallback: CallableFunction
}) => {
  const {
    data: announcement,
    onCloseCallback,
  } = props;

  const content = get(announcement, 'content');
  const title = get(announcement, 'title');

  const closeModal = () => {
    infoModal && infoModal.close();
  };

  useEffect(() => {

  }, []);

  const handleInfo = () => {
    infoModal = Modal.open({
      key: infoModalKey,
      title,
      closable: true,
      style: modalStyle,
      children: (
        <div className="c7n-boot-header-inbox-wrap">
          <div
            className="c7n-boot-header-inbox-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ),
      onOk: closeModal,
      okText: '返回',
      okCancel: false,
    });
  };

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-info`}>
        <Icon type="error_outline" style={{ fontSize: 20, color: '#FA541CFF' }} />
        <span dangerouslySetInnerHTML={{ __html: content && content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, '') }} />
      </div>
      <Button type="primary" funcType="raised" onClick={handleInfo} style={{ height: 26, fontSize: 13 }}>了解详情</Button>
    </div>
  );
};

export default PlatformAnnouncement;
