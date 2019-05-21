'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _menu = require('choerodon-ui/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

var _dec, _class;

require('choerodon-ui/lib/tooltip/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/menu/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _findFirstLeafMenu3 = require('../util/findFirstLeafMenu');

var _findFirstLeafMenu4 = _interopRequireDefault(_findFirstLeafMenu3);

var _util = require('../util');

require('./style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubMenu = _menu2['default'].SubMenu,
    Item = _menu2['default'].Item;
var CommonMenu = (_dec = (0, _mobxReact.inject)('AppState', 'MenuStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(CommonMenu, _Component);

  function CommonMenu() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, CommonMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = CommonMenu.__proto__ || Object.getPrototypeOf(CommonMenu)).call.apply(_ref, [this].concat(args))), _this), _this.savedOpenKeys = [], _this.handleClick = function (e) {
      var _this$props = _this.props,
          MenuStore = _this$props.MenuStore,
          AppState = _this$props.AppState;

      var child = MenuStore.getMenuData;
      var selected = _this.findSelectedMenuByCode(child, e.key);
      var paths = e.keyPath && e.keyPath.reverse()[0]; // 去掉boot的
      var selectedRoot = paths ? child.find(function (_ref2) {
        var code = _ref2.code;
        return code === paths;
      }) : selected;
      MenuStore.click(e.key, AppState.menuType.type, e.domEvent.currentTarget.innerText);
      if (selected) {
        var history = _this.props.history;

        MenuStore.treeReduce(selectedRoot, function (menu, parents, index) {
          if (index === 0 && !menu.subMenus) {
            MenuStore.setActiveMenu(selected);
            MenuStore.setSelected(selectedRoot);
            MenuStore.setOpenKeys([selected].concat((0, _toConsumableArray3['default'])(parents)).map(function (_ref3) {
              var code = _ref3.code;
              return code;
            }));
            return true;
          }
          return false;
        });

        var _findFirstLeafMenu = (0, _findFirstLeafMenu4['default'])(selected),
            route = _findFirstLeafMenu.route,
            domian = _findFirstLeafMenu.domian;

        var link = _this.getMenuLink(route);
        (0, _util.historyPushMenu)(history, link, domian);
      }
      _this.collapseMenu();
    }, _this.handleOpenChange = function (openKeys) {
      _this.props.MenuStore.setOpenKeys(openKeys);
    }, _this.handleLeftOpenChange = function (leftOpenKeys) {
      _this.props.MenuStore.setLeftOpenKeys(leftOpenKeys);
    }, _this.collapseMenu = function () {
      var _this$props2 = _this.props,
          AppState = _this$props2.AppState,
          MenuStore = _this$props2.MenuStore;

      MenuStore.setLeftOpenKeys([]);
      AppState.setMenuExpanded(false);
    }, _this.toggleRightMenu = function () {
      var MenuStore = _this.props.MenuStore;
      var collapsed = MenuStore.collapsed,
          openKeys = MenuStore.openKeys;

      if (collapsed) {
        MenuStore.setCollapsed(false);
        MenuStore.setOpenKeys(_this.savedOpenKeys);
      } else {
        _this.savedOpenKeys = openKeys;
        MenuStore.setCollapsed(true);
        MenuStore.setOpenKeys([]);
      }
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(CommonMenu, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.loadMenu(this.props);
      if (localStorage.getItem('rawStatistics')) {
        this.props.MenuStore.statistics = JSON.parse(localStorage.getItem('rawStatistics'));
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.loadMenu(nextProps);
    }
  }, {
    key: 'loadMenu',
    value: function loadMenu(props) {
      var _this2 = this;

      var location = props.location,
          AppState = props.AppState,
          MenuStore = props.MenuStore;
      var currentType = MenuStore.type,
          currentIsUser = MenuStore.isUser,
          currentId = MenuStore.id,
          selected = MenuStore.selected,
          collapsed = MenuStore.collapsed;
      var pathname = location.pathname;
      var _AppState$currentMenu = AppState.currentMenuType,
          type = _AppState$currentMenu.type,
          id = _AppState$currentMenu.id;

      if (type) {
        MenuStore.loadMenuData().then(function (menus) {
          var isUser = AppState.isTypeUser;
          if (pathname === '/') {
            MenuStore.setActiveMenu(null);
            MenuStore.setSelected(selected ? menus.find(function (_ref4) {
              var code = _ref4.code;
              return code === selected.code;
            }) || menus[0] : menus[0]);
            MenuStore.setType(type);
            MenuStore.setId(id);
            MenuStore.setIsUser(isUser);
            MenuStore.setOpenKeys([]);
          } else {
            MenuStore.treeReduce({ subMenus: menus }, function (menu, parents) {
              if (menu.route === pathname || pathname.indexOf(menu.route + '/') === 0) {
                var nCode = parents.length && parents[parents.length - 1].code;
                var oCode = selected && selected.code;
                if (oCode !== nCode || currentType !== type || isUser !== currentIsUser || currentId !== id) {
                  MenuStore.setOpenKeys(collapsed ? [] : [menu].concat((0, _toConsumableArray3['default'])(parents)).map(function (_ref5) {
                    var code = _ref5.code;
                    return code;
                  }));
                  _this2.savedOpenKeys = [menu].concat((0, _toConsumableArray3['default'])(parents)).map(function (_ref6) {
                    var code = _ref6.code;
                    return code;
                  });
                }
                MenuStore.setActiveMenu(menu);
                MenuStore.setSelected(parents[0]);
                MenuStore.setType(type);
                MenuStore.setId(id);
                MenuStore.setIsUser(isUser);
                return true;
              }
              return false;
            });
          }
          if (MenuStore.activeMenu && _this2.props.location.pathname !== '/') {
            document.getElementsByTagName('title')[0].innerText = MenuStore.activeMenu.name + ' \u2013 ' + MenuStore.activeMenu.parentName + ' \u2013 ' + (AppState.menuType.type !== 'site' ? AppState.menuType.name + ' \u2013 ' : '') + ' ' + (AppState.getSiteInfo.systemTitle || AppState.getSiteInfo.defaultTitle);
          }
        });
      }
    }
  }, {
    key: 'getMenuSingle',
    value: function getMenuSingle(data, num) {
      var _this3 = this;

      if (!data.subMenus) {
        var _findFirstLeafMenu2 = (0, _findFirstLeafMenu4['default'])(data),
            route = _findFirstLeafMenu2.route;

        var link = _react2['default'].createElement(
          _reactRouterDom.Link,
          {
            to: this.getMenuLink(route),
            onClick: function onClick() {
              return _this3.props.MenuStore.click(data.code, data.level, data.name);
            },
            style: {
              marginLeft: parseInt(num, 10) * 20
            }
          },
          _react2['default'].createElement(_icon2['default'], { type: data.icon }),
          _react2['default'].createElement(
            'span',
            null,
            data.name
          )
        );
        return _react2['default'].createElement(
          Item,
          {
            key: data.code
          },
          this.TooltipMenu(link, data.code)
        );
      } else {
        return _react2['default'].createElement(
          SubMenu,
          {
            key: data.code,
            className: 'common-menu-right-popup',
            title: _react2['default'].createElement(
              'span',
              {
                style: {
                  marginLeft: parseInt(num, 10) * 20
                }
              },
              _react2['default'].createElement(_icon2['default'], { type: data.icon }),
              _react2['default'].createElement(
                'span',
                null,
                data.name
              )
            )
          },
          data.subMenus.map(function (two) {
            return _this3.getMenuSingle(two, parseInt(num, 10) + 1);
          })
        );
      }
    }
  }, {
    key: 'TooltipMenu',
    value: function TooltipMenu(reactNode, code) {
      var AppState = this.props.AppState;

      if (AppState.getDebugger) {
        return _react2['default'].createElement(
          _tooltip2['default'],
          { defaultVisible: 'true', trigger: 'hover', placement: 'right' },
          reactNode
        );
      } else {
        return reactNode;
      }
    }
  }, {
    key: 'getMenuLink',
    value: function getMenuLink(route) {
      var AppState = this.props.AppState;
      var _AppState$currentMenu2 = AppState.currentMenuType,
          id = _AppState$currentMenu2.id,
          name = _AppState$currentMenu2.name,
          type = _AppState$currentMenu2.type,
          organizationId = _AppState$currentMenu2.organizationId,
          category = _AppState$currentMenu2.category;

      var search = '';
      switch (type) {
        case 'site':
          if (AppState.isTypeUser) {
            search = '?type=site';
          }
          break;
        case 'organization':
        case 'project':
          search = '?type=' + type + '&id=' + id + '&name=' + encodeURIComponent(name) + '&category=' + category;
          if (organizationId) {
            search += '&organizationId=' + organizationId;
          }
          break;
        default:
      }
      return '' + route + search;
    }
  }, {
    key: 'findSelectedMenuByCode',
    value: function findSelectedMenuByCode(child, code) {
      var _this4 = this;

      var selected = false;
      child.forEach(function (item) {
        if (selected) {
          return;
        }
        if (item.code === code) {
          selected = item;
        } else if (item.subMenus) {
          selected = _this4.findSelectedMenuByCode(item.subMenus, code);
        }
      });
      return selected;
    }
  }, {
    key: 'renderLeftMenu',
    value: function renderLeftMenu(child, selected, expanded) {
      var _this5 = this;

      if (child.length > 0) {
        var MenuStore = this.props.MenuStore;


        return _react2['default'].createElement(
          'div',
          { className: 'common-menu-left ' + (expanded ? 'expanded' : '') },
          _react2['default'].createElement(
            'div',
            {
              className: 'common-menu-left-header',
              role: 'none'
            },
            _react2['default'].createElement(
              _reactRouterDom.Link,
              { to: '/', onClick: this.collapseMenu },
              _react2['default'].createElement(_icon2['default'], { type: 'home' }),
              _react2['default'].createElement(
                'span',
                null,
                '\u4E3B\u9875'
              )
            )
          ),
          _react2['default'].createElement(
            'div',
            { className: 'common-menu-right-content' },
            _react2['default'].createElement(
              _menu2['default'],
              {
                onClick: this.handleClick,
                openKeys: MenuStore.leftOpenKeys.slice(),
                onOpenChange: this.handleLeftOpenChange,
                selectedKeys: [selected.code],
                mode: 'vertical'
              },
              child.map(function (item) {
                return _this5.renderLeftMenuItem(item, expanded);
              })
            )
          )
        );
      }
    }
  }, {
    key: 'renderLeftMenuItem',
    value: function renderLeftMenuItem(item, expanded) {
      var icon = _react2['default'].createElement(_icon2['default'], { type: item.icon });
      var text = void 0;
      if (expanded) {
        text = _react2['default'].createElement(
          'span',
          null,
          item.name
        );
      } else {
        icon = _react2['default'].createElement(
          _tooltip2['default'],
          { placement: 'right', title: item.name },
          icon
        );
      }
      if (!item.subMenus) {
        return _react2['default'].createElement(
          Item,
          { key: item.code },
          icon,
          text
        );
      } else {
        return _react2['default'].createElement(
          SubMenu,
          {
            onTitleClick: this.handleClick,
            key: item.code,
            className: 'common-menu-right-popup',
            title: _react2['default'].createElement(
              'span',
              null,
              icon,
              text
            )
          },
          item.subMenus.map(function (two) {
            return _react2['default'].createElement(
              Item,
              { key: two.code },
              _react2['default'].createElement(_icon2['default'], { type: two.icon, style: { marginLeft: 20 } }),
              _react2['default'].createElement(
                'span',
                null,
                two.name
              )
            );
          })
        );
      }
    }
  }, {
    key: 'renderRightMenu',
    value: function renderRightMenu(menu) {
      var _this6 = this;

      var _props$MenuStore = this.props.MenuStore,
          collapsed = _props$MenuStore.collapsed,
          openKeys = _props$MenuStore.openKeys,
          activeMenu = _props$MenuStore.activeMenu;

      return _react2['default'].createElement(
        'div',
        { className: (0, _classnames2['default'])('common-menu-right', { collapsed: collapsed }) },
        _react2['default'].createElement(
          _tooltip2['default'],
          { placement: 'right', title: collapsed ? menu.name : '' },
          _react2['default'].createElement(
            'div',
            { className: 'common-menu-right-header' },
            _react2['default'].createElement(_icon2['default'], { type: menu.icon }),
            _react2['default'].createElement(
              'span',
              null,
              menu.name
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'common-menu-right-content' },
          _react2['default'].createElement(
            _menu2['default'],
            {
              mode: 'inline',
              inlineCollapsed: collapsed,
              selectedKeys: [activeMenu && activeMenu.code],
              openKeys: openKeys.slice(),
              onOpenChange: this.handleOpenChange
            },
            menu.subMenus.map(function (two) {
              return _this6.getMenuSingle(two, 0);
            })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'common-menu-right-footer', onClick: this.toggleRightMenu },
          _react2['default'].createElement(_icon2['default'], { type: 'first_page' })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      // 服务的菜单
      var _props = this.props,
          MenuStore = _props.MenuStore,
          AppState = _props.AppState,
          location = _props.location;

      var child = MenuStore.getMenuData;
      if (child && child.length > 0) {
        var selected = MenuStore.selected;

        var expanded = AppState.getMenuExpanded;
        var mask = expanded && _react2['default'].createElement('div', {
          role: 'none',
          onClick: this.collapseMenu,
          className: 'common-menu-mask'
        });
        return _react2['default'].createElement(
          'div',
          { style: { height: '100%' } },
          _react2['default'].createElement(
            'div',
            { className: 'common-menu' },
            this.renderLeftMenu(child, selected || child[0], expanded),
            location.pathname !== '/' && this.renderRightMenu(selected || child[0])
          ),
          mask
        );
      } else {
        return null;
      }
    }
  }]);
  return CommonMenu;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = CommonMenu;