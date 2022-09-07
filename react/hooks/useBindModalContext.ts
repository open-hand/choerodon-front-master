import { useModal } from 'choerodon-ui/pro';
import { useEffect } from 'react';
import { Modal } from '../components/modal/store';
/**
 * 绑定当前页面的ModalContext
 */
function useBindModalContext() {
  const modal = useModal();
  useEffect(() => {
    Modal.setModal(modal);
    return () => Modal.setModal(undefined);
  }, [modal]);
}

export default useBindModalContext;
