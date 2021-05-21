import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Tooltip } from 'choerodon-ui/pro';
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
  }, []);

  function onBackBtnClick() {
    history.push(backPath);
  }

  function renderBackBtn() {
    let backBtn = null;
    if (backPath) {
      backBtn = (
        <Tooltip
          title="返回"
          placement="bottom"
          getTooltipContainer={(that) => that}
        >
          <Button
            onClick={onBackBtnClick}
            className="back-btn small-tooltip"
            shape="circle"
            size="default"
            funcType="flat"
            icon="arrow_back"
          />
        </Tooltip>
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
