import { useEffect, useCallback } from 'react';
import { useSessionStorageState } from 'ahooks';
import { Modal } from 'choerodon-ui/pro';
import { useHistory } from 'react-router';
import { useQueryString } from '@zknow/components';
import { useGetUserInfo } from '@/hooks/useUserInfo';
import { USERINFO_PATH } from '@/constants';

const modalKey = Modal.key();

/**
 * 用户密码到期的hook
 */
const useCheckPasswordOutdate = () => {
  const userInfo = useGetUserInfo();
  const [infoCheckFlag, setInfoCheckFlag] = useSessionStorageState<boolean>('infoCheckFlag');

  const history = useHistory();

  const {
    organizationId,
  } = useQueryString();

  const {
    changePasswordFlag,
  } = userInfo || {};

  const handleOpenCheckModal = useCallback(() => {
    const search = {
      type: 'user',
      organizationId,
    };
    const searchString = new URLSearchParams(search).toString();
    Modal.open({
      title: '密码到期提醒',
      key: modalKey,
      destroyOnClose: true,
      width: 520,
      children: '您的密码即将到期，为保证消息的正常接收及您的账户安全和后续的正常使用，请前往个人中心进行修改。',
      okText: '个人中心',
      onCancel: () => {
        setInfoCheckFlag(true);
      },
      onOk: () => {
        history.push({
          pathname: USERINFO_PATH,
          search: searchString,
        });
        setInfoCheckFlag(true);
      },
    });
  }, []);

  useEffect(() => {
    if (!infoCheckFlag && changePasswordFlag === 1) {
      handleOpenCheckModal();
    }
  }, []);
};

export default useCheckPasswordOutdate;
