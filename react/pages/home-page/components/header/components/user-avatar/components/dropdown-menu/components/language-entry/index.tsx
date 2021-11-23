import React, {
  useState,
  FC,
} from 'react';
import { Icon, Menu } from 'choerodon-ui/pro';
import { Popover } from 'choerodon-ui';
import './index.less';

export type LanguageEntryProps = {

  }

const prefixCls = 'c7ncd-language-entry';
const languageArr = [
  {
    name: '简体中文',
    value: '',
  },
  {
    name: 'English (US)',
    value: '',
  },
];

const LanguageEntry:FC<LanguageEntryProps> = () => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const popoverContent = () => (
    <Menu>
      {languageArr.map((item) => (
        <Menu.Item>
          {item.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const languageSwitch = () => {
    setPopoverVisible(!popoverVisible);
  };

  const handleVisibleChange = (visible:boolean) => {
    setPopoverVisible(visible);
  };

  return (
    <Popover overlayClassName="c7ncd-language-entry-popover" content={popoverContent} title={null} placement="bottom" visible={popoverVisible} onVisibleChange={handleVisibleChange}>
      <div className={prefixCls} role="none" onClick={(e) => { e.stopPropagation(); languageSwitch(); }}>
        <Icon type="language" />
        <span>语言切换</span>
      </div>
    </Popover>
  );
};

export default LanguageEntry;
