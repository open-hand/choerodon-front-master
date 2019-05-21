'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _modal = require('choerodon-ui/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _input = require('choerodon-ui/lib/input');

var _input2 = _interopRequireDefault(_input);

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

var _table = require('choerodon-ui/lib/table');

var _table2 = _interopRequireDefault(_table);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _icon = require('choerodon-ui/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _select = require('choerodon-ui/lib/select');

var _select2 = _interopRequireDefault(_select);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _dec, _class;

require('choerodon-ui/lib/modal/style');

require('choerodon-ui/lib/input/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/table/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/select/style');

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouterDom = require('react-router-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mobx = require('mobx');

var _findFirstLeafMenu2 = require('../util/findFirstLeafMenu');

var _findFirstLeafMenu3 = _interopRequireDefault(_findFirstLeafMenu2);

var _util = require('../util');

var _constants = require('@choerodon/boot/lib/containers/common/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabPane = _tabs2['default'].TabPane;
var Option = _select2['default'].Option;

var prefixCls = _constants.PREFIX_CLS + '-boot-header-menu-type';

function getButtonIcon(type) {
  switch (type) {
    case 'organization':
      return 'domain';
    case 'project':
      return 'project_line';
    default:
  }
}

var MenuType = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore', 'MenuStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(MenuType, _Component);

  function MenuType(props) {
    (0, _classCallCheck3['default'])(this, MenuType);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (MenuType.__proto__ || Object.getPrototypeOf(MenuType)).call(this, props));

    _this.showModal = function () {
      var HeaderStore = _this.props.HeaderStore;

      HeaderStore.setSelected(null);
      HeaderStore.setMenuTypeVisible(true);
      _this.setState({
        searchValue: '',
        handlesearch: false
      });
    };

    _this.handleOk = function () {
      var HeaderStore = _this.props.HeaderStore;

      HeaderStore.setMenuTypeVisible(false);
      _this.selectState(HeaderStore.getSelected);
    };

    _this.handleCancel = function () {
      _this.props.HeaderStore.setMenuTypeVisible(false);
    };

    _this.handleChange = function (value) {
      _this.setState({
        filterOrganization: value,
        activeKey: null
      });
    };

    _this.handleTabChange = function (activeKey) {
      _this.setState({
        activeKey: activeKey
      });
    };

    _this.searchInput = function (e) {
      _this.setState({
        searchValue: e.target.value
      });
    };

    _this.searchChange = function () {
      var searchValue = _this.state.searchValue;

      _this.setState({
        handlesearch: !!searchValue
      });
    };

    _this.selectState = function (value) {
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          HeaderStore = _this$props.HeaderStore,
          MenuStore = _this$props.MenuStore,
          history = _this$props.history;
      var id = value.id,
          name = value.name,
          type = value.type,
          organizationId = value.organizationId,
          category = value.category;

      HeaderStore.setRecentItem(value);
      MenuStore.loadMenuData({ type: type, id: id }, false).then(function (menus) {
        var route = void 0;
        var path = void 0;
        var domain = void 0;
        if (menus.length) {
          var _findFirstLeafMenu = (0, _findFirstLeafMenu3['default'])(menus[0]),
              menuRoute = _findFirstLeafMenu.route,
              menuDomain = _findFirstLeafMenu.domain;

          route = menuRoute;
          domain = menuDomain;
        }
        if (route) {
          path = '/?type=' + type + '&id=' + id + '&name=' + encodeURIComponent(name) + (category ? '&category=' + category : '');
          if (organizationId) {
            path += '&organizationId=' + organizationId;
          }
        }
        if (path) {
          (0, _util.historyPushMenu)(history, path, domain);
        }
      });
      AppState.setMenuExpanded(false);
      HeaderStore.setMenuTypeVisible(false);
    };

    _this.handleExpand = function (record) {
      var _this$state = _this.state,
          expandRowKey = _this$state.expandRowKey,
          collapseRowKey = _this$state.collapseRowKey,
          handlesearch = _this$state.handlesearch;

      var keys = handlesearch ? collapseRowKey : expandRowKey;
      var key = record.key;

      var index = keys.indexOf(key);
      if (index !== -1) {
        keys.splice(index, 1);
      } else {
        keys.push(key);
      }
      _this.setState({
        expandRowKey: expandRowKey,
        collapseRowKey: collapseRowKey
      });
    };

    _this.handleReturnButtonClick = function () {
      _this.setState({
        searchValue: '',
        handlesearch: false
      });
    };

    _this.getIconType = function (record) {
      if (record && record.type === 'project') {
        switch (record.category) {
          case 'AGILE':
            return 'project_line';
          case 'PROGRAM':
            return 'project_group';
          case 'ANALYTICAL':
            return 'project_program_analyze';
          default:
            return 'project_line';
        }
      } else {
        return 'domain';
      }
    };

    _this.getTypeString = function (record) {
      if (record.type === 'project') {
        switch (record.category) {
          case 'AGILE':
            return '敏捷项目';
          case 'PROGRAM':
            return '普通项目群';
          case 'ANALYTICAL':
            return '分析型项目群';
          default:
            return 'project';
        }
      } else {
        return '组织'; // style fix
      }
    };

    _this.state = {
      filterOrganization: '',
      searchValue: '',
      handlesearch: false,
      expandRowKey: [],
      collapseRowKey: [],
      activeKey: null
    };
    return _this;
  }

  // 展示modal


  // 确认模态框


  // 取消模态框


  // select 选择


  // search 搜索


  // 选择组织和项目数据


  (0, _createClass3['default'])(MenuType, [{
    key: 'renderDefaultExpandAllRows',
    value: function renderDefaultExpandAllRows(dataSource) {
      var _state = this.state,
          filterOrganization = _state.filterOrganization,
          expandRowKey = _state.expandRowKey,
          collapseRowKey = _state.collapseRowKey,
          handlesearch = _state.handlesearch;

      if (handlesearch) {
        return dataSource.map(function (data) {
          return data.key;
        }).filter(function (key) {
          return collapseRowKey.indexOf(key) === -1;
        });
      } else if (filterOrganization !== '' && filterOrganization !== 'total') {
        return dataSource.length ? [dataSource[0].key] : [];
      } else {
        return expandRowKey;
      }
    }
  }, {
    key: 'renderTable',
    value: function renderTable(dataSource, isNotRecent) {
      var _this2 = this;

      var HeaderStore = this.props.HeaderStore;

      if (dataSource && dataSource.length) {
        var columns = [{
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: '220px',
          render: function render(text, record) {
            return record.into === false ? _react2['default'].createElement(
              'span',
              { className: prefixCls + '-disabled' },
              text
            ) : _react2['default'].createElement(
              _react2['default'].Fragment,
              null,
              _react2['default'].createElement('span', { className: 'c7n-table-row-expand-icon c7n-table-row-spaced' }),
              _react2['default'].createElement(
                'a',
                {
                  role: 'none',
                  onClick: _this2.selectState.bind(_this2, record)
                },
                _react2['default'].createElement(_icon2['default'], { type: _this2.getIconType(record) }),
                text
              )
            );
          }
        }, {
          title: '编码',
          dataIndex: 'code',
          key: 'code',
          width: '120px',
          render: function render(text, record) {
            if (record.into === false) {
              return _react2['default'].createElement(
                'span',
                { className: prefixCls + '-disabled' },
                text
              );
            }
            return text;
          }
        }, {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          width: 116,
          render: function render(text, record) {
            if (record.into === false) {
              return _react2['default'].createElement(
                'span',
                { className: prefixCls + '-disabled' },
                _this2.getTypeString(record)
              );
            }
            return _this2.getTypeString(record);
          }
        }];
        var selected = HeaderStore.getSelected;
        var rowSelection = {
          type: 'radio',
          onSelect: function onSelect(record) {
            HeaderStore.setSelected(record);
          },
          selectedRowKeys: selected ? [selected.key] : [],
          hideDefaultSelections: true
        };
        var props = {};
        if (isNotRecent) {
          props = {
            expandedRowKeys: this.renderDefaultExpandAllRows(dataSource),
            onExpand: function onExpand(expanded, record) {
              _this2.handleExpand(record);
            }
          };
        }
        var onTableRow = function onTableRow(record) {
          if (record.into === false) {
            return {};
          }
          return {
            onDoubleClick: function onDoubleClick() {
              _this2.selectState(record);
            },
            onClick: function onClick() {
              HeaderStore.setSelected(record);
              if (isNotRecent) {
                _this2.handleExpand(record);
              }
            }
          };
        };
        return _react2['default'].createElement(_table2['default'], (0, _extends3['default'])({
          columns: columns,
          dataSource: dataSource,
          filterBar: false,
          onRow: onTableRow,
          pagination: isNotRecent && dataSource.length > 30 ? { defaultPageSize: 30 } : false,
          scroll: { y: isNotRecent && dataSource.length > 30 ? 300 : 330 },
          fixed: true,
          rowSelection: rowSelection
        }, props));
      } else {
        return _react2['default'].createElement(
          'div',
          { className: prefixCls + '-empty' },
          isNotRecent ? '您还没有在任何组织或项目中被分配角色' : '您没有最近浏览记录'
        );
      }
    }
  }, {
    key: 'hitSearch',
    value: function hitSearch(item, value) {
      var name = item.name,
          code = item.code;

      return name.indexOf(value) !== -1 || code.indexOf(value) !== -1;
    }
  }, {
    key: 'getOptionList',
    value: function getOptionList() {
      var HeaderStore = this.props.HeaderStore;

      var org = (0, _mobx.toJS)(HeaderStore.getOrgData);
      return org && org.length > 0 ? [_react2['default'].createElement(
        Option,
        { key: 'total', value: 'total' },
        '\u6240\u6709\u7EC4\u7EC7'
      )].concat(org.map(function (orgOption) {
        return _react2['default'].createElement(
          Option,
          { key: orgOption.id, value: orgOption.id },
          orgOption.name
        );
      })) : _react2['default'].createElement(
        Option,
        { value: 'total' },
        '\u65E0\u7EC4\u7EC7'
      );
    }
  }, {
    key: 'getCurrentData',
    value: function getCurrentData() {
      var _this3 = this;

      var HeaderStore = this.props.HeaderStore;
      var _state2 = this.state,
          filterOrganization = _state2.filterOrganization,
          handlesearch = _state2.handlesearch,
          searchValue = _state2.searchValue;

      var needFilterOrganization = filterOrganization !== '' && filterOrganization !== 'total';
      var orgData = (0, _mobx.toJS)(HeaderStore.getOrgData);
      var proData = (0, _mobx.toJS)(HeaderStore.getProData);
      if (orgData && proData) {
        return orgData.filter(function (item) {
          var id = item.id;

          if (needFilterOrganization && Number(id) !== Number(filterOrganization)) {
            return false;
          }
          item.key = id;
          item.children = [];
          proData.forEach(function (item2) {
            var id2 = item2.id,
                organizationId = item2.organizationId;

            item2.key = id + ',' + id2;
            if (Number(organizationId) === Number(id) && (!handlesearch || _this3.hitSearch(item2, searchValue))) {
              item.children.push(item2);
            }
          });
          if (!item.children.length) {
            delete item.children;
          }
          if (!item.children && (handlesearch && !_this3.hitSearch(item, searchValue) || item.into === false)) {
            return false;
          }
          return true;
        });
      }
      return orgData;
    }
  }, {
    key: 'renderModalContent',
    value: function renderModalContent() {
      var _state3 = this.state,
          handlesearch = _state3.handlesearch,
          searchValue = _state3.searchValue,
          activeKey = _state3.activeKey,
          filterOrganization = _state3.filterOrganization;
      var _props = this.props,
          _props$AppState$curre = _props.AppState.currentMenuType,
          _props$AppState$curre2 = _props$AppState$curre.name,
          selectTitle = _props$AppState$curre2 === undefined ? '选择项目' : _props$AppState$curre2,
          type = _props$AppState$curre.type,
          _props$HeaderStore = _props.HeaderStore,
          visible = _props$HeaderStore.menuTypeVisible,
          recentItem = _props$HeaderStore.getRecentItem,
          getSelected = _props$HeaderStore.getSelected;

      var currentData = this.getCurrentData();
      var tabSelect = activeKey || (filterOrganization || !recentItem || recentItem.length === 0 ? 'total' : 'recent');
      if (handlesearch) {
        return _react2['default'].createElement(
          'div',
          { className: prefixCls + '-table-wrapper' },
          this.renderTable(currentData, true)
        );
      } else {
        return _react2['default'].createElement(
          _tabs2['default'],
          { activeKey: tabSelect, onChange: this.handleTabChange },
          _react2['default'].createElement(
            TabPane,
            { tab: '\u6700\u8FD1', key: 'recent', className: prefixCls + '-tab-body' },
            this.renderTable(recentItem, false)
          ),
          _react2['default'].createElement(
            TabPane,
            { tab: '\u5168\u90E8', key: 'total', className: prefixCls + '-tab-body' },
            this.renderTable(currentData, true)
          )
        );
      }
    }
  }, {
    key: 'renderModalFooter',
    value: function renderModalFooter() {
      var getSelected = this.props.HeaderStore.getSelected;

      return [_react2['default'].createElement(
        _button2['default'],
        { key: 'back', onClick: this.handleCancel },
        '\u53D6\u6D88'
      ), _react2['default'].createElement(
        _button2['default'],
        { key: 'submit', type: 'primary', disabled: !getSelected, onClick: this.handleOk },
        '\u6253\u5F00'
      )];
    }
  }, {
    key: 'renderReturnButton',
    value: function renderReturnButton() {
      var handlesearch = this.state.handlesearch;

      if (handlesearch) {
        return _react2['default'].createElement(_button2['default'], {
          funcType: 'raised',
          icon: 'return',
          onClick: this.handleReturnButtonClick
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state4 = this.state,
          handlesearch = _state4.handlesearch,
          searchValue = _state4.searchValue;
      var _props2 = this.props,
          _props2$AppState$curr = _props2.AppState.currentMenuType,
          _props2$AppState$curr2 = _props2$AppState$curr.name,
          selectTitle = _props2$AppState$curr2 === undefined ? '选择项目' : _props2$AppState$curr2,
          type = _props2$AppState$curr.type,
          category = _props2$AppState$curr.category,
          visible = _props2.HeaderStore.menuTypeVisible;

      var buttonClass = (0, _classnames2['default'])(prefixCls + '-button', { active: type === 'organization' || type === 'project' });
      var toolbarClass = (0, _classnames2['default'])(prefixCls + '-toolbar', { 'has-search': handlesearch });
      var buttonIcon = getButtonIcon(type);
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          _button2['default'],
          {
            className: buttonClass,
            funcType: 'flat',
            onClick: this.showModal
          },
          buttonIcon && _react2['default'].createElement(_icon2['default'], { type: this.getIconType({ category: category, type: type }) }),
          selectTitle,
          _react2['default'].createElement(_icon2['default'], { type: 'arrow_drop_down' })
        ),
        _react2['default'].createElement(
          _modal2['default'],
          {
            title: '\u9009\u62E9',
            className: prefixCls + '-modal',
            visible: visible,
            onOk: this.handleOk,
            onCancel: this.handleCancel,
            footer: this.renderModalFooter(),
            width: 708,
            closable: false,
            center: true
          },
          _react2['default'].createElement(
            'section',
            { className: toolbarClass },
            this.renderReturnButton(),
            _react2['default'].createElement(
              _select2['default'],
              {
                className: prefixCls + '-organization-select',
                label: '\u7EC4\u7EC7',
                placeholder: 'Please Select',
                defaultValue: 'total',
                onChange: this.handleChange
              },
              this.getOptionList()
            ),
            _react2['default'].createElement(_input2['default'], {
              prefix: _react2['default'].createElement(_icon2['default'], { type: 'search' }),
              placeholder: '\u641C\u7D22\u7EC4\u7EC7\u548C\u9879\u76EE',
              value: searchValue,
              onChange: this.searchInput,
              onBlur: this.searchChange,
              onPressEnter: this.searchChange
            })
          ),
          this.renderModalContent()
        )
      );
    }
  }]);
  return MenuType;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = MenuType;