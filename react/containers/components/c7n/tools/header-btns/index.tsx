import React, { useMemo, Fragment, ReactElement } from 'react';
import groupBy from 'lodash/groupBy';
import initial from 'lodash/initial';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import Permission from '@/containers/components/c7n/tools/permission';
import { Button, Tooltip, Divider } from 'choerodon-ui';

import './index.less';

export interface itemsProps {
  display: boolean,
  name: string,
  handler?(): void,
  permissions?: Array<string>,
  disabled?: boolean,
  disabledMessage?: string,
  icon: string,
  group?: number,
}

const HeaderButtons = ({ items, children, showClassName = true }: {
  items: Array<itemsProps>,
  children?: ReactElement,
  showClassName?: boolean
}) => {
  const displayBtn = useMemo(() => items.filter(({ display }) => display), [items]);

  const btnNodes = useMemo(() => {
    const btnGroups = map(groupBy(displayBtn, 'group'), (value) => {
      const Split = <Divider key={Math.random()} type="vertical" className="c7ncd-header-split" />;

      const btns = map(value, ({
        name, handler, permissions, display, disabled, disabledMessage, ...props
      }) => {
        const btn = (
          <Button
            {...props}
            disabled={disabled}
            className="c7ncd-header-btn"
            funcType="flat"
            onClick={handler}
            type="primary"
          >
            {name}
          </Button>
        );
        return (
          <Fragment key={name}>
            {permissions && permissions.length ? (
              <Permission service={permissions}>
                {disabled && disabledMessage ? (
                  <Tooltip title={disabledMessage || ''} placement="bottom">
                    {btn}
                  </Tooltip>
                ) : btn}
              </Permission>
            ) : btn}
          </Fragment>
        );
      });

      return [...btns, Split];
    });

    return initial(flatten(btnGroups));
  }, [displayBtn]);

  return displayBtn.length ? (
    <div
      style={{
        direction: 'rtl',
      }}
      className={showClassName ? 'c7ncd-header-btns' : ''}
    >
      {btnNodes}
      {children}
    </div>
  ) : null;
};

HeaderButtons.defaultProps = {
  children: undefined,
  showClassName: true,
};

export default HeaderButtons;
