import React, {
  FC,
} from 'react';
import { Icon } from 'choerodon-ui/pro';
import { Popover } from 'choerodon-ui';
import classNames from 'classnames';
import { LANGUAGE_GROUPS } from '@/constants';
import './index.less';
import { useCurrentLanguage, useFormatCommon, useFormatMessage } from '@/hooks';
import useChangeLanguage from './hook/useChangeLanguage';
import { useUserAvatarStore } from '../../../../stores';

export type LanguageToggleProps = {

}

const prefixCls = 'c7ncd-language-toggle';
const intlPrefix = 'c7ncd.language.toggle';

const LanguageToggle:FC<LanguageToggleProps> = (props) => {
  const format = useFormatCommon();
  const currentLang = useCurrentLanguage();
  const handleChangeLanguage = useChangeLanguage();

  const {
    formatUserAvater,
  } = useUserAvatarStore();

  const renderLanguageMenu = () => (
    <div className={`${prefixCls}-menu`}>
      {
        LANGUAGE_GROUPS.map((language, idnex) => {
          const cls = classNames(`${prefixCls}-menu-item`, {
            [`${prefixCls}-menu-item-selected`]: currentLang === language,
          });
          return (
            // eslint-disable-next-line
            <div
              onClick={() => handleChangeLanguage(language)}
              role="button"
              className={cls}
              key={language}
              tabIndex={0}
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
      <div role="button" className={prefixCls}>
        <Icon type="language" />
        <span>{formatUserAvater({ id: 'languageSwicth' })}</span>
      </div>
    </Popover>
  );
};

export default LanguageToggle;
