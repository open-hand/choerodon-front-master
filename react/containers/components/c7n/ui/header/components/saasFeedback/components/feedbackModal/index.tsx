import React, { EventHandler } from 'react';
import { Icon, Modal } from 'choerodon-ui/pro';
import classNames from 'classnames';
import ReactDom from 'react-dom';
import { useSaaSFeedbackStore } from '../../stores';
// @ts-ignore
import TopBg from '../../assets/top.svg';

import './index.less';
import SaaSFeedbackForm from '../feedbackForm';

const saasFeedbackKey = Modal.key();

const FeedbackModal = () => {
  const {
    prefixCls,
    mainStore,
  } = useSaaSFeedbackStore();

  const contentCls = classNames(`${prefixCls}-modal`, {
    [`${prefixCls}-modal-show`]: mainStore.isOpen,
    [`${prefixCls}-modal-hide`]: !mainStore.isOpen,
  });

  const openForm = () => {
    Modal.open({
      key: saasFeedbackKey,
      title: '提交工单',
      children: <SaaSFeedbackForm />,
      drawer: true,
      style: {
        width: 'calc(100% - 3.5rem)',
      },
      okText: '关闭',
      okCancel: false,
    });
  };

  const content = (
    <div
      className={contentCls}
      role="none"
    >
      <div
        className={`${prefixCls}-modal-top`}
      >
        <Icon type="close" />
        <img
          alt=""
          src={TopBg}
          role="none"
          onClick={(e:any) => e.stopPropagation()}
        />
      </div>
      <div
        role="none"
        className={`${prefixCls}-modal-list`}
        onClick={(e:any) => e.stopPropagation()}
      >
        <div className={`${prefixCls}-modal-list-item`}>
          <Icon type="collections_bookmark-o" />
          <div onClick={openForm} role="none" className={`${prefixCls}-modal-list-text`}>
            <span>
              问题反馈
            </span>
            <span>
              通过提交工单的形式，反馈您的问题
            </span>
          </div>
        </div>
        <div
          role="none"
          onClick={() => {
            window.open('https://open.hand-china.com/contact');
          }}
          className={`${prefixCls}-modal-list-item`}
        >
          <Icon type="add_ic_call-o" />
          <div className={`${prefixCls}-modal-list-text`}>
            <span>
              联系我们
            </span>
            <span>
              通过邮箱等方式联系我们
            </span>
          </div>
        </div>
        <div className={`${prefixCls}-modal-list-item`} style={{ cursor: 'not-allowed' }}>
          <Icon type="live_help-o" />
          <div className={`${prefixCls}-modal-list-text`}>
            <span>
              商务咨询
            </span>
            <span>
              400-168-4263
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDom.createPortal(content, document.querySelector('body') as HTMLElement);
};

export default FeedbackModal;
