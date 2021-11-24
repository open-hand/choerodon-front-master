import React, {
  useEffect, FC, useRef,
} from 'react';
import { Popover } from 'choerodon-ui';
import { useBoolean } from 'ahooks';
import { Tabs, Icon } from 'choerodon-ui/pro';
import {} from '@choerodon/components';

import './index.less';
import { map } from 'lodash';
import C7NIcon from '@/assets/images/favicon.svg';
import LocaleLists from './components/locale-lists';
import { IS_LOCAL } from '@/constants';

export type DevToolProps = {

}

const { TabPane } = Tabs;

const prefixCls = 'c7ncd-dev-tool';

const DevTool:FC<DevToolProps> = () => {
  const [visible, { setFalse, setTrue }] = useBoolean(false);

  const tabs = {
    公共多语言: <LocaleLists />,
    文档: <>todo</>,
  };

  const renderContent = () => (
    <div className={`${prefixCls}-popover-content`}>
      <h4>Choerodon Front DevTool</h4>
      <Icon type="close" onClick={setFalse} />
      <Tabs>
        {
        map(tabs, (item, key) => (
          <TabPane tab={key} key={key}>
            {item}
          </TabPane>
        ))
        }
      </Tabs>
    </div>
  );

  if (!IS_LOCAL) {
    return null;
  }

  return (
    <Popover visible={visible} content={renderContent()} placement="topLeft" trigger={['click'] as any}>
      <div className={prefixCls} onClick={visible ? setFalse : setTrue} role="none">
        <img src={C7NIcon} alt="c7n-dev-tools" />
      </div>
    </Popover>
  );
};

export default DevTool;
