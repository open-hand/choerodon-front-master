import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import { Btns as ApproveBtns } from './useBtns';
import './ApproveModal.less';
import Detail from './components/detail';
import History from './components/history';

const prefix = 'c7n-backlogApprove-modal';

const Tabs = [
  {
    title: '需求详情',
    key: 'detail',
  },
  {
    title: '审核意见',
    key: 'suggest',
  },
  {
    title: '审核历史',
    key: 'history',
  },
  {
    title: '缩略图',
    key: 'miniPic',
  },
];
const ApproveModal = ({
  record, demandDetailStore, organizationId, modal,
}) => {
  const [activeTab, setActiveTab] = useState('detail');

  useEffect(() => {
    demandDetailStore.select(record.get('id') || '150913943852666880');
    demandDetailStore.initApi(organizationId);
    demandDetailStore.refresh();
  }, [demandDetailStore, organizationId, record]);

  const handleClickClose = useCallback(() => {
    modal.close();
  }, [modal]);

  return (
    <div className={`${prefix}-container`}>
      <div className={`${prefix}-container-title`}>
        <span className={`${prefix}-container-title-span`}>审核详情</span>
        <div className={`${prefix}-container-title-tab`}>
          {
            Tabs.map((item) => (
              <Button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`${prefix}-container-title-tab-btn ${prefix}-container-title-tab-${activeTab === item.key ? 'active' : 'default'}`}
              >
                {item.title}

              </Button>
            ))
          }
        </div>
        <div className={`${prefix}-container-title-close`}>
          <Icon type="close" onClick={handleClickClose} />
        </div>
      </div>
      <div className={`${prefix}-container-content`}>
        {
          activeTab === 'detail' && (
            <Detail store={demandDetailStore} />
          )
        }
        {
          activeTab === 'history' && (
            <History store={demandDetailStore} />
          )
        }
      </div>
      <div className={`${prefix}-container-footer`}>
        <ApproveBtns>
          {
            ({ loading, btns }) => (
              <>
                {
                  (!loading ? (btns || []) : []).map((item) => (
                    <Button
                      key={item.id}
                      className={`${prefix}-container-footer-btn`}
                      funcType="raised"
                    >
                      {item.name}
                    </Button>
                  ))
                }
              </>
            )
          }
        </ApproveBtns>
        <Button
          className={`${prefix}-container-footer-btn`}
          funcType="raised"
        >
          抄送
        </Button>
      </div>
    </div>
  );
};

const ObserverApproveModal = observer(ApproveModal);

const openApproveModal = (props) => {
  Modal.open({
    key: 'backlogApproveModal',
    title: null,
    className: prefix,
    style: {
      width: 1200,
      height: 560,
    },
    children: <ObserverApproveModal {...props} />,
    footer: null,
  });
};

export default openApproveModal;
