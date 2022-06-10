import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon } from 'choerodon-ui';
import { Modal } from 'choerodon-ui/pro';
import get from 'lodash/get';
import { observer } from 'mobx-react-lite';
import './index.less';
import axios from '@/components/axios';

const prefixCls = 'c7ncd-platform-announcement';

const imgPartten = /<img(.*?)>/g;
const htmlTagParttrn = /<[^>]*>/g;

const modalStyle = {
  minWidth: '8rem',
  // position: 'fixed',
  // left: 0,
  // margin: 'auto',
  // right: 0,
  // height: 'fit-content',
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
    readId:string
  },
  onCloseCallback: CallableFunction
}) => {
  const {
    data: announcement,
    onCloseCallback,
  } = props;

  const content = get(announcement, 'content');
  const title = get(announcement, 'title');
  const readId = get(announcement, 'readId');

  const [isFull, setFull] = useState<boolean>(false);

  const closeModal = () => {
    console.log(infoModal, 'infoModal');
    window.localStorage.setItem('announcementModalInfo', `${readId}+true`);
    infoModal && infoModal.close();
  };

  const renderAnnounceTitle = useCallback(() => (
    <div className={`${prefixCls}-modal-title`}>
      <span>
        {title}
        qw
      </span>
      <Icon
        style={{
          cursor: 'pointer',
          float: 'right',
        }}
        type={isFull ? 'fullscreen_exit' : 'fullscreen'}
        onClick={() => {
          console.log(isFull);
          setFull(!isFull);
        }}
      />
    </div>
  ), [isFull]);

  useEffect(() => {
    infoModal && infoModal.update({
      fullScreen: isFull,
      title: renderAnnounceTitle(),
    });
  }, [isFull]);

  useEffect(() => {
    const announcementModalShowed = window.localStorage.getItem('announcementModalInfo')?.split('+')[1] !== 'false';
    if (!announcementModalShowed) {
      handleInfo();
    }
  }, []);

  const InfoContent = (infoProps:any) => {
    const { modal } = infoProps;

    const handleOk = () => {
      window.localStorage.setItem('announcementModalInfo', `${readId}+true`);
      console.log('gogo');
      return true;
    };

    modal.handleOk(handleOk);

    return (
      <div
        className="c7n-boot-header-inbox-wrap"
        style={{
          maxHeight: '47vh',
        }}
      >
        <div
          className="c7n-boot-header-inbox-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  };

  const handleInfo = () => {
    infoModal = Modal.open({
      key: infoModalKey,
      title: renderAnnounceTitle(),
      style: modalStyle,
      movable: false,
      fullScreen: false,
      children: <InfoContent full={isFull} />,
      // onOk: () => {

      // },
      okText: '关闭',
      okCancel: false,
    });
  };

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-info`}>
        <Icon type="error_outline" style={{ fontSize: 20, color: '#FA541CFF' }} />
        <span dangerouslySetInnerHTML={{ __html: content && content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, '') }} />
        <Button type="primary" funcType="raised" onClick={handleInfo} style={{ height: 26, fontSize: 13 }}>了解详情</Button>
      </div>
    </div>
  );
};

export default observer(PlatformAnnouncement);
