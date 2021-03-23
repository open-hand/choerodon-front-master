import React, { useContext } from 'react';
import classNames from 'classnames';
import { Icon } from 'choerodon-ui';
import { FormattedMessage, injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { HEADER_TITLE_NAME } from '@/utils/constants';
import { Context } from '../tab-page/PageWrap';
import useTheme from "@/hooks/useTheme";

const PageContent = ({
  intl, AppState: { currentMenuType: { name = HEADER_TITLE_NAME } },
  values, className, code, children, style, title, description, link,
  ...props
}) => {
  const { isTab } = useContext(Context) || {};
  const [theme] = useTheme();
  const classString = classNames('page-content', className, {
    'page-content-theme4': isTab && theme === 'theme4',
  });
  if (code) {
    const { messages } = intl;
    title = intl.formatMessage({ id: `${code}.title` }, values || { name });
    description = intl.formatMessage({ id: `${code}.description` }, values);
    if (messages[`${code}.link`]) {
      link = intl.formatMessage({ id: `${code}.link` }, values);
    }
  }

  return (
    <div className={classString} style={style}>
      {
        (code || title || description) && (
          <div className="page-content-header">
            <div className="title">
              {title}
            </div>
            <div className="description">
              {description}
              {
                link && (
                  <a href={link} target="_blank" rel="noreferrer noopener">
                    <FormattedMessage id="learnmore" defaultMessage="了解更多" />
                    <Icon type="open_in_new" />
                  </a>
                )
              }
            </div>
          </div>
        )
      }
      {children}
    </div>
  );
};

export default injectIntl(inject('AppState')(observer(PageContent)));
