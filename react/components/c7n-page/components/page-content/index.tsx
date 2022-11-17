import React, { useContext } from 'react';
import classNames from 'classnames';
import { Icon } from 'choerodon-ui';
import { FormattedMessage, useIntl } from 'react-intl';
import { inject, MobXProviderContext } from 'mobx-react';
import { observer, useComputed } from 'mobx-react-lite';
import { HEADER_TITLE_NAME } from '@/utils/constants';
import { Context } from '@/components/c7n-tab-page';
import { PageContentProps } from '../../interface';
import './index.less';

const prefixCls = 'page-content';

const PageContent: React.FC<PageContentProps> = ({
  values,
  className,
  code,
  children,
  style,
  link,
}) => {
  const { isTab } = useContext(Context) as any;
  const { AppState } = useContext(MobXProviderContext);
  const name = useComputed(() => AppState.currentMenuType?.name || HEADER_TITLE_NAME);
  const { formatMessage, messages } = useIntl();

  const classString = classNames(prefixCls, className, {
    [`${prefixCls}-isTab`]: isTab,
  });

  const getPageContentHeader = () => {
    if (code) {
      return (
        <div className={`${prefixCls}-header`}>
          <div className="title">
            {formatMessage({ id: `${code}.title` }, values || { name })}
          </div>
          <div className="description">
            {formatMessage({ id: `${code}.description` }, values)}
            {
              link && messages[`${code}.link`] && (
                <a href={formatMessage({ id: `${code}.link` }, values)} target="_blank" rel="noreferrer noopener">
                  <FormattedMessage id="learnmore" defaultMessage="了解更多" />
                  <Icon type="open_in_new" />
                </a>
              )
            }
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={classString} style={style}>
      {
        getPageContentHeader()
      }
      {children}
    </div>
  );
};

export default inject('AppState')(observer(PageContent));
