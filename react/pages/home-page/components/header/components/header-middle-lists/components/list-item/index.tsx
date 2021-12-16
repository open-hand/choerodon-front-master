import React from 'react';
import { useHistory, useLocation } from 'react-router';
import classNames from 'classnames';
import { OverflowWrap, useQueryString } from '@choerodon/components';
import { Permission } from '@/components/permission';
import { PermissionService } from '@/components/permission/interface';
import getSearchString from '@/utils/gotoSome';
import { useFormatMessage } from '@/hooks';

type ListItemProps = {
  permissions?:PermissionService
  path:string
  title:string
}

const prefixCls = 'c7ncd-header-middle-lists-item';
const intlPrefix = 'c7ncd.header.middle.lists.item';

const ListItem:React.FC<ListItemProps> = (props) => {
  const {
    permissions,
    path,
    title,
  } = props;

  const location = useLocation();
  const history = useHistory();

  const { organizationId } = useQueryString();

  const formatMiddleListsItem = useFormatMessage(intlPrefix);
  const itemName = formatMiddleListsItem({ id: title });

  const {
    pathname,
  } = location;

  const itemCls = classNames(prefixCls, {
    [`${prefixCls}-active`]: pathname.indexOf(path) !== -1,
  });

  async function goto() {
    const search = await getSearchString('organization', 'id', organizationId);
    history.push(`${path}${search}`);
  }

  const itemContent = (
    <div className={itemCls} role="none" onClick={goto}>
      <OverflowWrap width="auto">
        {itemName}
      </OverflowWrap>
    </div>
  );

  if (permissions?.length) {
    return (
      <Permission type="organization" service={permissions}>
        {itemContent}
      </Permission>
    );
  }

  return itemContent;
};

export default ListItem;
