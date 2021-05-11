import React, { useMemo, Fragment, ReactElement } from 'react';
import groupBy from 'lodash/groupBy';
import initial from 'lodash/initial';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import Permission from '@/containers/components/c7n/tools/permission';
import { Divider } from 'choerodon-ui';
import { Button, Tooltip } from 'choerodon-ui/pro';

import './index.less';
import classNames from 'classnames';
import { ButtonColor } from 'choerodon-ui/pro/lib/button/enum';

export interface itemsProps {
  display: boolean,
  name: string,
  handler?(): void,
  permissions?: Array<string>,
  disabled?: boolean,
  disabledMessage?: string,
  icon: string,
  group?: number,
  color?: ButtonColor,
}

const HeaderButtons = ({ items, children, showClassName = true }: {
  items: Array<itemsProps>,
  children?: ReactElement,
  showClassName?: boolean
}) => {
  const displayBtn = useMemo(() => items.filter(({ display }) => display), [items]);

  const cls = classNames('c7ncd-header-btn-flex', {
    'c7ncd-header-btns': showClassName,
  });

  const btnNodes = useMemo(() => {
    const btnGroups = map(groupBy(displayBtn, 'group'), (value) => {
      const Split = <Divider key={Math.random()} type="vertical" className="c7ncd-header-split" />;

      const btns = map(value, ({
        name, handler, permissions, display, icon, disabled, disabledMessage, color = 'default' as ButtonColor, ...props
      }, index:number) => {
        let btn:React.ReactNode;
        const transColor = index === 0 ? 'primary' as ButtonColor : color;
        if (icon === 'refresh') {
          btn = (
            <Button
              {...props}
              disabled={disabled}
              className="c7ncd-header-btn"
              onClick={handler}
              icon={icon}
            />
          );
        } else {
          btn = (
            <Button
              {...props}
              disabled={disabled}
              className="c7ncd-header-btn"
              onClick={handler}
              color={transColor}
              icon={icon}
            >
              {name}
            </Button>
          );
        }
        return (
          <Fragment key={name}>
            {permissions && permissions.length ? (
              <Permission service={permissions}>
                {disabled && disabledMessage ? (
                  <Tooltip title={disabledMessage} placement="bottom">
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
      className={cls}
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
