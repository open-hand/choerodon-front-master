'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

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

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mobxReact = require('mobx-react');

var _constants = require('../../../common/constants');

require('./style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var prefixCls = _constants.PREFIX_CLS + '-boot-header-banner';
var imgPartten = /<img(.*?)>/g;
var htmlTagParttrn = /<[^>]*>/g;

var AnnouncementBanner = (_dec = (0, _mobxReact.inject)('AppState', 'HeaderStore', 'MenuStore'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(AnnouncementBanner, _Component);

  function AnnouncementBanner() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, AnnouncementBanner);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AnnouncementBanner.__proto__ || Object.getPrototypeOf(AnnouncementBanner)).call.apply(_ref, [this].concat(args))), _this), _this.handleClose = function () {
      _this.props.HeaderStore.closeAnnouncement();
    }, _this.handleInfo = function () {
      window.open('/#/iam/user-msg?type=site&msgType=announcement');
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(AnnouncementBanner, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.HeaderStore.axiosGetNewSticky();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          src = _props.src,
          children = _props.children,
          className = _props.className,
          _props$HeaderStore = _props.HeaderStore,
          announcementClosed = _props$HeaderStore.announcementClosed,
          content = _props$HeaderStore.announcement.content;

      return announcementClosed ? null : _react2['default'].createElement(
        'div',
        {
          className: (0, _classnames2['default'])('' + prefixCls, className)
        },
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-info' },
          _react2['default'].createElement(_icon2['default'], { type: 'info', style: { fontSize: 24, color: '#d50000' } }),
          _react2['default'].createElement('span', { dangerouslySetInnerHTML: { __html: content && content.replace(imgPartten, '[图片]').replace(htmlTagParttrn, '') } })
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-buttons' },
          _react2['default'].createElement(
            _button2['default'],
            { onClick: this.handleClose },
            '\u5173\u95ED\u63D0\u793A'
          ),
          _react2['default'].createElement(
            _button2['default'],
            { type: 'primary', funcType: 'raised', onClick: this.handleInfo },
            '\u4E86\u89E3\u8BE6\u60C5'
          )
        )
      );
    }
  }]);
  return AnnouncementBanner;
}(_react.Component)) || _class) || _class);
exports['default'] = AnnouncementBanner;