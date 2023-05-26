import React, {
  FC, useEffect, useState,
} from 'react';
import { Button } from 'choerodon-ui/pro';
import axios from '@/components/axios';
import AppState from '@/containers/stores/c7n/AppState';
import { useCurrentLanguage } from '@/hooks';
import './index.less';

export type ExtraButtonProps = {

}

const prefixCls = 'c7ncd-extra-button';

const ExtraButton:FC<ExtraButtonProps> = (props) => {
  const language = useCurrentLanguage();
  const [btnVisible, setBtnVisible] = useState(false);

  useEffect(() => {
    if (AppState?.currentMenuType?.organizationId && (window as any).basePro) {
      axios.get(`/iam/v1/huawei/check_saas?tenant_id=${AppState?.currentMenuType?.organizationId}`).then((res) => {
        setBtnVisible(res);
      });
    }
  }, [AppState?.currentMenuType?.organizationId]);

  const handleUpgradeBtnClick = () => {
    window.open('https://marketplace.huaweicloud.com/contents/b18fc5c6-d952-4f16-9770-9ab782d0d4ed');
  };

  return (
    <div className={prefixCls}>
      {
       btnVisible ? (
         <Button
           onClick={handleUpgradeBtnClick}
           type={'primary' as any}
           funcType={'flat' as any}
           icon="publish-o"
         >
           {language === 'zh_CN' ? '升级续费' : 'Purchase'}
         </Button>
       ) : ''
      }
    </div>
  );
};

export default ExtraButton;
