import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Button, Modal } from 'choerodon-ui';
import './index.less';

const prefixCls = 'c7ncd-userConfirm';

const UserConfirmation = (props) => {
  const {
    when = false, title = false, content = '', footer = false,
  } = props;

  const [isShowModal, setIsShowModal] = useState(false);
  const history = useHistory();
  const [nextLocation, setNextLocation] = useState(null);
  const [action, setAction] = useState();
  const [unblock, setUnblock] = useState(null);

  useEffect(() => {
    if (!when || unblock) {
      return;
    }
    const cancel = history.block((tnextLocation, taction) => {
      if (when) {
        setIsShowModal(true);
      }
      setNextLocation(tnextLocation);
      setAction(taction);
      return false;
    });
    cancel && setUnblock(() => cancel);
  }, [unblock, when]);

  useEffect(() => () => {
    unblock && unblock();
  }, [unblock]);

  function onConfirm() {
    unblock && unblock();
    if (action === 'PUSH') {
      history.push(nextLocation);
    } else if (action === 'POP') {
      history.goBack();
    } else if (action === 'REPLACE') {
      history.replace(nextLocation);
    }
    setIsShowModal(false);
  }

  function onCancel() {
    setIsShowModal(false);
  }

  return (
    <>
      {isShowModal && (
      <Modal
        visible
        closable={false}
        className={prefixCls}
        footer={footer || (
          <div className={`${prefixCls}-footer`}>
            <Button type="default" onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" onClick={onConfirm}>
              确认
            </Button>
          </div>
        )}
      >
          {title && (
          <div className={`${prefixCls}-title`}>
            {title}
          </div>
          )}
        <div className={`${prefixCls}-content`}>
          {content || '确认进行跳转？'}
        </div>
      </Modal>
      )}
    </>
  );
};

export default UserConfirmation;
