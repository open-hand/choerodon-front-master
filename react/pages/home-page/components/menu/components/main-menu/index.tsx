import React, {
  useEffect, FC, useMemo, CSSProperties,
} from 'react';
import { observer } from 'mobx-react-lite';
import {} from 'choerodon-ui/pro';
import {} from '@choerodon/components';
import { map } from 'lodash';

import './index.less';
import classNames from 'classnames';
import { useMenuStore } from '../../stores';
import { DEFAULT_THEME_COLOR } from '@/constants';
import MenuBgImg from '../../assets/MenuBgImg.svg';
import { ICON_MAP } from '../../stores/CONSTANTS';
// 导入svg的图片
import '../../services/handleSvgImport';

export type MainMenuProps = {

}

const prefixCls = 'c7ncd-main-menu';
const intlPrefix = 'c7ncd.main.menu';

const MainMenu:FC<MainMenuProps> = () => {
  const {
    type,
    MenuStore: {
      getActiveMenuRoot,
      getMenuData,
    },
    AppState: {
      getSiteInfo,
      menuType,
    },
  } = useMenuStore();

  // 获取当前层级的menu数据
  const menuData = getMenuData;

  // 这里是获取全局以及设置到Store里头的选中的父级菜单
  const activeMenuRoot = getActiveMenuRoot[menuType?.type] || {};

  // 个人信息中的themeColor
  const personalColor = getSiteInfo?.themeColor as string;

  /** @type {CSSProperties} 处理mainMenu背景逻辑 */
  const getMainMenuStyles = useMemo(():CSSProperties => {
    // 是否用户信息中选择的这个颜色也是和平台默认的颜色一样
    const isTheSame = personalColor?.toLowerCase() === DEFAULT_THEME_COLOR;
    const background = (isTheSame || !personalColor) ? `url(${MenuBgImg})` : personalColor;
    return {
      background,
      backgroundSize: 'cover',
    };
  }, [personalColor]);

  const renderItems = () => map(menuData, (item:{
    code: keyof typeof ICON_MAP,
    id: string,
    name:string
  }, index:number) => {
    const {
      id: menuId,
      name: menuName,
      code: menuCode,
    } = item || {};
    // 通过id判断是否当前选中的menu
    const isActive = activeMenuRoot.id === menuId;
    const cls = classNames(`${prefixCls}-item`, { [`${prefixCls}-item-active`]: isActive });
    // 匹配菜单的svg string
    const svgLink = ICON_MAP?.[menuCode] || 'xiezuo';
    return (
      <div
        role="none"
        className={cls}
        key={menuCode}
      >
        <div className={`${prefixCls}-item-icon`}>
          <svg style={{ height: 30 }} aria-hidden="true">
            {/* 图片这里命名是new匹配new的svg */}
            <use xlinkHref={`#${svgLink}new.sprite`} />
          </svg>
        </div>
        <span>
          {menuName}
        </span>
      </div>
    );
  });

  return (
    <div className={prefixCls} style={getMainMenuStyles}>
      {renderItems()}
    </div>
  );
};

export default observer(MainMenu);
