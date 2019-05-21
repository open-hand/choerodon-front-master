'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;
// import AnnouncementBanner from '../header/AnnouncementBanner';


require('choerodon-ui/lib/spin/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _mobxReact = require('mobx-react');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

var _menu = require('../menu');

var _menu2 = _interopRequireDefault(_menu);

var _header = require('../header');

var _header2 = _interopRequireDefault(_header);

var _util = require('../util');

var _findFirstLeafMenu2 = require('../util/findFirstLeafMenu');

var _findFirstLeafMenu3 = _interopRequireDefault(_findFirstLeafMenu2);

require('./style');

var _Guide = require('../guide/Guide');

var _Guide2 = _interopRequireDefault(_Guide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var spinStyle = {
  textAlign: 'center',
  paddingTop: 300
};

var outwardPath = ['/organization/register-organization', '/organization/register-organization/agreement'];

function parseQueryToMenuType(search) {
  var menuType = {};
  if (search) {
    var _queryString$parse = _queryString2['default'].parse(search),
        type = _queryString$parse.type,
        name = _queryString$parse.name,
        id = _queryString$parse.id,
        organizationId = _queryString$parse.organizationId,
        category = _queryString$parse.category;

    if (type) {
      menuType.type = type;
    }
    if (category) {
      menuType.category = category;
    }
    if (name) {
      menuType.name = name;
    }
    if (id) {
      menuType.id = id;
      if (type === 'project') {
        menuType.projectId = id;
      } else if (type === 'organization') {
        menuType.organizationId = id;
      }
    }
    if (type === 'project' && organizationId) {
      menuType.organizationId = organizationId;
    }
  }

  return menuType;
}

var Masters = (_dec = (0, _mobxReact.inject)('AppState', 'MenuStore', 'HeaderStore'), (0, _reactRouterDom.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Masters, _Component);

  function Masters() {
    (0, _classCallCheck3['default'])(this, Masters);
    return (0, _possibleConstructorReturn3['default'])(this, (Masters.__proto__ || Object.getPrototypeOf(Masters)).apply(this, arguments));
  }

  (0, _createClass3['default'])(Masters, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.initMenuType(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.initMenuType(nextProps);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var pathname = this.props.location.pathname;
      var getUserId = this.props.AppState.getUserId;

      this.initFavicon();
      if (pathname.includes('access_token') && pathname.includes('token_type') && localStorage.getItem('historyPath-' + getUserId)) {
        window.location = '/#' + localStorage.getItem('historyPath-' + getUserId);
      }
    }
  }, {
    key: 'initFavicon',
    value: function initFavicon() {
      var AppState = this.props.AppState;

      AppState.loadSiteInfo().then(function (data) {
        var link = document.createElement('link');
        var linkDom = document.getElementsByTagName('link');
        if (linkDom) {
          for (var i = 0; i < linkDom.length; i += 1) {
            if (linkDom[i].getAttribute('rel') === 'shortcut icon') document.head.removeChild(linkDom[i]);
          }
        }
        link.id = 'dynamic-favicon';
        link.rel = 'shortcut icon';
        link.href = data.favicon || 'favicon.ico';
        document.head.appendChild(link);
        data.defaultTitle = document.getElementsByTagName('title')[0].innerText;
        if (data.systemTitle) {
          document.getElementsByTagName('title')[0].innerText = data.systemTitle;
        }
        AppState.setSiteInfo(data);
      });
    }
  }, {
    key: 'initMenuType',
    value: function initMenuType(props) {
      var location = props.location,
          MenuStore = props.MenuStore,
          HeaderStore = props.HeaderStore,
          history = props.history,
          AppState = props.AppState,
          dashboard = props.dashboard;
      var pathname = location.pathname,
          search = location.search;

      var isUser = false;
      var needLoad = false;
      var menuType = parseQueryToMenuType(search);
      if (pathname === '/') {
        if (!dashboard) {
          var recent = HeaderStore.getRecentItem;
          if (recent.length && !sessionStorage.home_first_redirect) {
            var _recent$ = recent[0],
                id = _recent$.id,
                name = _recent$.name,
                type = _recent$.type,
                organizationId = _recent$.organizationId;

            menuType = { id: id, name: name, type: type, organizationId: organizationId };
            needLoad = true;
          } else {
            menuType = {};
          }
          sessionStorage.home_first_redirect = 'yes';
        }
      } else if (menuType.type === 'site') {
        isUser = true;
      } else if (!menuType.type) {
        menuType.type = 'site';
      }
      AppState.setTypeUser(isUser);
      AppState.changeMenuType(menuType);
      if (needLoad) {
        MenuStore.loadMenuData().then(function (menus) {
          if (menus.length) {
            var _findFirstLeafMenu = (0, _findFirstLeafMenu3['default'])(menus[0]),
                route = _findFirstLeafMenu.route,
                domain = _findFirstLeafMenu.domain;

            var _AppState$currentMenu = AppState.currentMenuType,
                _type = _AppState$currentMenu.type,
                _name = _AppState$currentMenu.name,
                _id = _AppState$currentMenu.id,
                _organizationId = _AppState$currentMenu.organizationId;

            var path = route + '?type=' + _type + '&id=' + _id + '&name=' + _name;
            if (_organizationId) {
              path += '&organizationId=' + _organizationId;
            }
            (0, _util.historyReplaceMenu)(history, path, domain);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          AutoRouter = _props.AutoRouter,
          GuideRouter = _props.GuideRouter,
          AppState = _props.AppState;

      if (outwardPath.includes(this.props.location.pathname)) {
        return _react2['default'].createElement(
          'div',
          { className: 'page-wrapper' },
          _react2['default'].createElement(AutoRouter, null)
        );
      } else {
        return AppState.isAuth && AppState.currentMenuType ? _react2['default'].createElement(
          'div',
          { className: 'page-wrapper' },
          _react2['default'].createElement(
            'div',
            { className: 'page-header' },
            _react2['default'].createElement(_header2['default'], null)
          ),
          _react2['default'].createElement(
            'div',
            { className: 'page-body' },
            _react2['default'].createElement(
              'div',
              { className: 'content-wrapper' },
              _react2['default'].createElement(
                'div',
                { id: 'menu' },
                _react2['default'].createElement(_menu2['default'], null)
              ),
              _react2['default'].createElement(
                'div',
                { id: 'autoRouter', className: 'content' },
                _react2['default'].createElement(AutoRouter, null)
              ),
              _react2['default'].createElement(
                'div',
                { id: 'guide', className: 'guide' },
                _react2['default'].createElement(_Guide2['default'], { guide: GuideRouter })
              )
            )
          )
        ) : _react2['default'].createElement(
          'div',
          { style: spinStyle },
          _react2['default'].createElement(_spin2['default'], null)
        );
      }
    }
  }]);
  return Masters;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Masters;