import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { Size } from 'choerodon-ui/lib/_util/enum';
import { FuncType } from 'choerodon-ui/pro/lib/button/enum';
import { PageHeaderProps } from '../../interface';

const prefixCls = 'page-head';

const PageHeader:React.FC<PageHeaderProps> = (props) => {
  const {
    backPath = null,
    children,
    className,
  } = props;

  const history = useHistory();

  const onBackBtnClick = () => {
    backPath && history.push(backPath);
  };

  function renderBackBtn() {
    let backBtn = null;
    if (backPath) {
      backBtn = (
        <Tooltip
          title="返回"
          placement="bottom"
        >
          <Button
            onClick={onBackBtnClick}
            className={`${prefixCls}-back-btn`}
            size={'default' as Size}
            funcType={'flat' as FuncType}
            icon="arrow_back"
          />
        </Tooltip>
      );
    }
    return backBtn;
  }

  return (
    <div
      className={classNames(prefixCls, className)}
    >
      {renderBackBtn()}
      {children}
    </div>
  );
};

export default observer(PageHeader);
