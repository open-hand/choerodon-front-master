import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Modal } from 'choerodon-ui/pro';
import { usePersistFn } from 'ahooks';
import './index.less';

const UserConfirmation = (props) => {
  const {
    when = false, title = false, content = '', footer = false,
  } = props;

  const history = useHistory();
  const [nextLocation, setNextLocation] = useState(null);
  const [action, setAction] = useState();
  const [unblock, setUnblock] = useState(null);
  const openModal = usePersistFn(() => {
    Modal.open({
      closable: false,
      title,
      onOk: onConfirm,
      children: content || '确认进行跳转？',
    });
  });
  useEffect(() => {
    !when && unblock && unblock();
    if (!when || unblock) {
      return;
    }
    const cancel = history.block((tnextLocation, taction) => {
      if (when) {
        openModal();
      }
      setNextLocation(tnextLocation);
      setAction(taction);
      return false;
    });
    setUnblock(() => cancel);
  }, [unblock, when, openModal]);

  useEffect(() => () => {
    unblock && unblock();
  }, []);

  function onConfirm() {
    unblock && unblock();
    if (action === 'PUSH') {
      history.push(nextLocation);
    } else if (action === 'POP') {
      history.goBack();
    } else if (action === 'REPLACE') {
      history.replace(nextLocation);
    }
  }

  return null;
};

export default UserConfirmation;
