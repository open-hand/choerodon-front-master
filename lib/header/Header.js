'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _button = require('choerodon-ui/lib/button');

var _button2 = _interopRequireDefault(_button);

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

var _dec, _class;
// import Favorites from '../favorites';


require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _reactRouter = require('react-router');

var _MenuType = require('./MenuType');

var _MenuType2 = _interopRequireDefault(_MenuType);

var _Logo = require('./Logo');

var _Logo2 = _interopRequireDefault(_Logo);

var _Setting = require('./Setting');

var _Setting2 = _interopRequireDefault(_Setting);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

var _Inbox = require('./Inbox');

var _Inbox2 = _interopRequireDefault(_Inbox);

var _constants = require('@choerodon/boot/lib/containers/common/constants');

require('./style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var prefixCls = _constants.PREFIX_CLS + '-boot-header';

var Header = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore', 'MenuStore'), (0, _reactRouter.withRouter)(_class = _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Header, _Component);

  function Header() {
    (0, _classCallCheck3['default'])(this, Header);
    return (0, _possibleConstructorReturn3['default'])(this, (Header.__proto__ || Object.getPrototypeOf(Header)).apply(this, arguments));
  }

  (0, _createClass3['default'])(Header, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          AppState = _props.AppState,
          HeaderStore = _props.HeaderStore,
          MenuStore = _props.MenuStore;

      MenuStore.loadMenuData({ type: 'site' }, false);
      HeaderStore.axiosGetOrgAndPro(AppState.getUserId);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var getUserId = this.props.AppState.getUserId;

      localStorage.setItem('historyPath-' + getUserId, nextProps.location.pathname + nextProps.location.search);
    }
  }, {
    key: 'handleGuideClick',
    value: function handleGuideClick() {
      var AppState = this.props.AppState;

      AppState.setGuideExpanded(!AppState.getGuideExpanded);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          imgUrl = _props2.AppState.getUserInfo.image_url,
          getSiteMenuData = _props2.MenuStore.getSiteMenuData,
          history = _props2.history;

      return _react2['default'].createElement(
        'div',
        { className: prefixCls + '-wrap' },
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-left' },
          _react2['default'].createElement(_Logo2['default'], { history: history })
        ),
        _react2['default'].createElement(
          'ul',
          { className: prefixCls + '-center' },
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(_MenuType2['default'], null)
          ),
          getSiteMenuData.length > 0 && _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(_Setting2['default'], null)
          )
        ),
        _react2['default'].createElement(
          'ul',
          { className: prefixCls + '-right' },
          _react2['default'].createElement('li', null),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              _button2['default'],
              { functype: 'flat', shape: 'circle', onClick: function onClick() {
                  return _this2.handleGuideClick();
                } },
              _react2['default'].createElement(_icon2['default'], { type: 'school' })
            )
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(_Inbox2['default'], null)
          ),
          _react2['default'].createElement(
            'li',
            { style: { marginLeft: 20 } },
            _react2['default'].createElement(_User2['default'], { imgUrl: imgUrl })
          )
        )
      );
    }
  }]);
  return Header;
}(_react.Component)) || _class) || _class) || _class);
exports['default'] = Header;