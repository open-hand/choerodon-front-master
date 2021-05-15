import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Tooltip } from 'choerodon-ui';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

const PageHeader = ({
  backPath = null,
  children, className, history, MenuStore,
  AppState, title, intl, location,
}) => {
  useEffect(() => {
    let titleText = null;
    if (title && title.props && title.props.id) {
      titleText = intl.formatMessage({ id: title.props.id, values: title.props.value });
    }
    // if (MenuStore.activeMenu && location.pathname !== '/') {
    //   setTimeout(() => {
    //     document.getElementsByTagName('title')[0].innerText = `${titleText && titleText !== MenuStore.activeMenu.name ? `${titleText} – ` : ''}${MenuStore.activeMenu.name} – ${MenuStore.activeMenu.parentName} – ${AppState.menuType.type !== 'site' ? `${AppState.menuType.name} – ` : ''} ${AppState.getSiteInfo.systemTitle || AppState.getSiteInfo.defaultTitle}`;
    //   }, 500);
    // }
  }, []);

  function onBackBtnClick() {
    history.push(backPath);
  }

  function renderBackBtn() {
    let backBtn = null;
    if (backPath) {
      backBtn = (
        <div style={{ lineHeight: '39px' }}>
          <Tooltip
            title="返回"
            placement="bottom"
            getTooltipContainer={that => that}
          >
            <Button
              type="primary"
              onClick={onBackBtnClick}
              className="back-btn small-tooltip"
              shape="circle"
              size="large"
              icon="arrow_back"
            />
          </Tooltip>
        </div>
      );
    }
    return backBtn;
  }

  return (
    <div
      className={
        classNames('page-head', className, 'theme4-page-head')
      }
    >
      {renderBackBtn()}
      {children}
    </div>
  );
};

export default withRouter(inject('AppState', 'MenuStore')(injectIntl(observer(PageHeader))));
