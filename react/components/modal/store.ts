import React from 'react';
import {
  observable, computed, action, set,
} from 'mobx';
import { useModal, Modal as UIModal } from 'choerodon-ui/pro';
import useBindContextModal from '@/hooks/useBindModalContext';

const defaultModal = {
  ...UIModal,
};
export type IModalProps = ReturnType<typeof useModal> & {
  key: () => any
}
class ModalStore {
  @observable currentModal: IModalProps = defaultModal as any;

  @computed get modal() {
    return this.currentModal;
  }

  @action
  setModal(data: any) {
    set(this.currentModal, { ...defaultModal, ...data, key: UIModal.key });
  }
}
/** 替换UI导出的Modal */
const modalStore = new ModalStore();
/** 替换UI导出的Modal */
const Modal = modalStore.currentModal;
export { Modal, modalStore };
