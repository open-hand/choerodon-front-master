import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import classNames from 'classnames';
import { Permission } from '@/components/permission';
import { PermissionService } from '@/components/permission/interface';
import getSearchString from '@/containers/components/c7n/util/gotoSome';

type ListItemProps = {
  permissions?:PermissionService
  path:string
  title:string
}

const prefixCls = 'c7ncd-header-middle-lists-item';

const ListItem:React.FC<ListItemProps> = (props) => {
  const {
    permissions,
    path,
    title,
  } = props;

  const location = useLocation();
  const history = useHistory();

  const { organizationId } = useParams<{organizationId:string}>();

  const {
    pathname,
  } = location;

  const itemCls = classNames(prefixCls, {
    [`${prefixCls}-active`]: pathname.startsWith(path),
  });

  async function goto() {
    const search = await getSearchString('organization', 'id', organizationId);
    history.push(`${path}${search}`);
  }

  const itemContent = (
    <div className={itemCls} role="none" onClick={goto}>
      {title}
    </div>
  );

  if (permissions?.length) {
    <Permission type="organization" service={permissions}>
      {itemContent}
    </Permission>;
  }

  return itemContent;
};

export default ListItem;
