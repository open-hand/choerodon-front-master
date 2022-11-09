import { useModal } from 'choerodon-ui/pro';
import { useEffect } from 'react';
import { modalStore } from '../components/modal/store';
/**
 * 绑定当前页面的ModalContext
 */
function useBindModalContext() {
  const modal = useModal();
  useEffect(() => {
    modalStore.setModal(modal);
    return () => modalStore.setModal(undefined);
  }, [modal]);
}

export default useBindModalContext;
