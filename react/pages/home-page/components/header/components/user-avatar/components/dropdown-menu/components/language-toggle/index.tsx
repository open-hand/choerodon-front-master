import React, {
  FC,
} from 'react';
import { Icon } from 'choerodon-ui/pro';
import { Popover } from 'choerodon-ui';
import classNames from 'classnames';
import { LANGUAGE_GROUPS } from '@/constants';
import './index.less';
import { useCurrentLanguage, useFormatMessage } from '@/hooks';
import useChangeLanguage from './hook/useChangeLanguage';

export type LanguageToggleProps = {

}

const prefixCls = 'c7ncd-language-toggle';
const intlPrefix = 'c7ncd.language.toggle';

const LanguageToggle:FC<LanguageToggleProps> = (props) => {
  const format = useFormatMessage();
  const currentLang = useCurrentLanguage();

  const handleChangeLanguage = useChangeLanguage();

  const renderLanguageMenu = () => (
    <div className={`${prefixCls}-menu`}>
      {
        LANGUAGE_GROUPS.map((language, idnex) => {
          const cls = classNames(`${prefixCls}-menu-item`, {
            [`${prefixCls}-menu-item-selected`]: currentLang === language,
          });
          return (
            <div
              onClick={() => handleChangeLanguage(language)}
              role="none"
              className={cls}
              key={language}
            >
              {format({ id: language })}
            </div>
          );
        })
      }
    </div>
  );

  return (
    <Popover overlayClassName={`${prefixCls}-overlay`} placement={'left' as any} trigger={['hover'] as any} content={renderLanguageMenu}>
      <div className={prefixCls}>
        <Icon type="language" />
        <span>语言切换</span>
      </div>
    </Popover>
  );
};

export default LanguageToggle;
