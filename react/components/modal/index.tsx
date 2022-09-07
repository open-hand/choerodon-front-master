/** 弹窗模态框 */
import React from 'react';
import useBindContextModal from '@/hooks/useBindModalContext';
import { Modal } from './store';
/**
 * Modal的消费者
 * 会自动绑定当前最近的ModalContext
 * @example
 * import React from 'react';
import { ModalProvider } from 'choerodon-ui/pro';
import { Switch, Route } from 'react-router-dom';
import ModalConsumer from '@choerodon/master/lib/components/modal';

function RouteIndex({ children }:{children:any}) {
  return (
    <ModalProvider>
      <ModalConsumer>
        <Switch>
          {children}
          <Route path="*" component={() => <></>} />
        </Switch>
      </ModalConsumer>
    </ModalProvider>
  );
}
// 页面使用
import React, { useCallback } from 'react';
import { Modal } from '@choerodon/master/lib/components/modal';

function Page() {
  const handleOpen = useCallback(() => {
    Modal.open({
      // ....
    });
  }, []);
}

 * @param param0
 * @returns
 */
const ModalConsumer: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  useBindContextModal();
  return children;
};
export { Modal, useBindContextModal };
export default ModalConsumer;
