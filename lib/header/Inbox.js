'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _badge = require('choerodon-ui/lib/badge');

var _badge2 = _interopRequireDefault(_badge);

var _spin = require('choerodon-ui/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

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

var _card = require('choerodon-ui/lib/card');

var _card2 = _interopRequireDefault(_card);

var _tabs = require('choerodon-ui/lib/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

var _dec, _class;
// import timeago from 'timeago-react';


require('choerodon-ui/lib/badge/style');

require('choerodon-ui/lib/spin/style');

require('choerodon-ui/lib/button/style');

require('choerodon-ui/lib/icon/style');

require('choerodon-ui/lib/card/style');

require('choerodon-ui/lib/tabs/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _timeagoReact = require('timeago-react');

var _timeagoReact2 = _interopRequireDefault(_timeagoReact);

var _mobxReact = require('mobx-react');

var _boot = require('@choerodon/boot');

var _mouseOverWrapper = require('../mouseOverWrapper');

var _mouseOverWrapper2 = _interopRequireDefault(_mouseOverWrapper);

var _constants = require('@choerodon/boot/lib/containers/common/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixCls = _constants.PREFIX_CLS + '-boot-header-inbox';
var popoverPrefixCls = prefixCls + '-popover';
var siderPrefixCls = prefixCls + '-sider';
// timeago.register('zh_CN', require('./locale/zh_CN'));

/* eslint-disable-next-line */
var reg = /\n|&nbsp;|&lt|&gt|<[^a\/][^>]*>|<\/[^a][^>]*>/g;
var TabPane = _tabs2['default'].TabPane;
var Meta = _card2['default'].Meta;

var iconMap = {
  'msg': 'textsms',
  'notice': 'volume_up'
};

var Inbox = (_dec = (0, _mobxReact.inject)('HeaderStore', 'AppState'), _dec(_class = (0, _mobxReact.observer)(_class = function (_Component) {
  (0, _inherits3['default'])(Inbox, _Component);

  function Inbox() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Inbox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Inbox.__proto__ || Object.getPrototypeOf(Inbox)).call.apply(_ref, [this].concat(args))), _this), _this.cleanMsg = function (e, data) {
      e.stopPropagation();
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          HeaderStore = _this$props.HeaderStore;

      HeaderStore.readMsg(AppState.userInfo.id, data);
    }, _this.cleanAllMsg = function () {
      var _this$props2 = _this.props,
          AppState = _this$props2.AppState,
          HeaderStore = _this$props2.HeaderStore;

      HeaderStore.readMsg(AppState.userInfo.id);
      HeaderStore.setInboxVisible(false);
    }, _this.openSettings = function () {
      window.open('/#/iam/receive-setting?type=site');
    }, _this.handleButtonClick = function () {
      var HeaderStore = _this.props.HeaderStore;

      if (!HeaderStore.inboxLoaded) {
        HeaderStore.setInboxLoading(true);
        _this.getUnreadMsg();
      }
      _this.handleVisibleChange(!HeaderStore.inboxVisible);
    }, _this.handleMessage = function () {
      _this.props.HeaderStore.setInboxLoaded(false);
    }, _this.handleMessageClick = function (e) {
      _this.handleVisibleChange(false);
    }, _this.handleVisibleChange = function (visible) {
      var HeaderStore = _this.props.HeaderStore;

      HeaderStore.setInboxVisible(visible);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Inbox, [{
    key: 'getUnreadMsg',
    value: function getUnreadMsg() {
      var _props = this.props,
          AppState = _props.AppState,
          HeaderStore = _props.HeaderStore;

      HeaderStore.axiosGetUserMsg(AppState.getUserId);
    }
  }, {
    key: 'renderMessages',
    value: function renderMessages(inboxData) {
      var _this2 = this;

      var AppState = this.props.AppState;

      if (inboxData.length > 0) {
        return _react2['default'].createElement(
          'ul',
          null,
          inboxData.map(function (data) {
            var title = data.title,
                content = data.content,
                id = data.id,
                sendByUser = data.sendByUser,
                type = data.type,
                sendTime = data.sendTime;

            var showPicUrl = void 0;
            if (content.indexOf('<img') !== -1) {
              showPicUrl = content.slice(content.indexOf('<img src="') + '<img src="'.length, content.indexOf('">', content.indexOf('<img src="')));
            }
            return _react2['default'].createElement(
              'li',
              { className: prefixCls + '-sider-content-list', key: data.id },
              _react2['default'].createElement(
                'div',
                { className: prefixCls + '-sider-content-list-title' },
                _react2['default'].createElement(
                  'span',
                  null,
                  _react2['default'].createElement(_icon2['default'], { type: iconMap[data.type], style: { marginRight: 10 } }),
                  title
                ),
                _react2['default'].createElement(_icon2['default'], {
                  type: 'close',
                  style: { color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' },
                  onClick: function onClick(e) {
                    return _this2.cleanMsg(e, data);
                  }
                })
              ),
              _react2['default'].createElement(
                'div',
                { className: prefixCls + '-sider-content-list-description' },
                _react2['default'].createElement(
                  'div',
                  { style: { maxHeight: 63, overflow: 'hidden' } },
                  _react2['default'].createElement('p', { id: 'li-' + id, dangerouslySetInnerHTML: { __html: '' + content.replace(reg, '') } }),
                  document.querySelector('#li-' + id) && document.querySelector('#li-' + id).offsetHeight > 63 ? _react2['default'].createElement(
                    'a',
                    { href: '#', target: '_blank', rel: 'noreferrer noopener' },
                    _react2['default'].createElement(
                      'span',
                      null,
                      '\u4E86\u89E3\u66F4\u591A'
                    ),
                    _react2['default'].createElement(_icon2['default'], { type: 'open_in_new' })
                  ) : null
                ),
                showPicUrl ?
                // eslint-disable-next-line jsx-a11y/alt-text
                _react2['default'].createElement('img', { style: { maxWidth: '100%', marginTop: 10 }, src: showPicUrl }) : null
              ),
              _react2['default'].createElement(
                'div',
                { className: prefixCls + '-sider-content-list-time' },
                _react2['default'].createElement(_timeagoReact2['default'], {
                  datetime: sendTime.slice(0, sendTime.length - 3),
                  locale: Choerodon.getMessage('zh_CN', 'en')
                })
              )
            );
          })
        );
      } else {
        return _react2['default'].createElement(
          'div',
          { className: prefixCls + '-empty' },
          '\u6682\u65F6\u6CA1\u6709\u7AD9\u5185\u6D88\u606F'
        );
      }
    }
  }, {
    key: 'renderPopoverContent',
    value: function renderPopoverContent(inboxData, inboxLoading) {
      var _this3 = this;

      var HeaderStore = this.props.HeaderStore;

      return _react2['default'].createElement(
        'div',
        { className: !inboxData.length ? 'is-empty' : null, style: { disable: 'flex', flexDirection: 'column', height: '100%' } },
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-sider-header' },
          _react2['default'].createElement(
            'div',
            { className: prefixCls + '-sider-header-title' },
            _react2['default'].createElement(
              'h3',
              null,
              '\u6D88\u606F\u901A\u77E5'
            ),
            _react2['default'].createElement(_button2['default'], {
              funcType: 'flat',
              type: 'primary',
              icon: 'close',
              shape: 'circle',
              onClick: function onClick() {
                return _this3.handleVisibleChange(!HeaderStore.inboxVisible);
              }
            })
          ),
          _react2['default'].createElement(
            'div',
            { className: prefixCls + '-sider-header-action' },
            _react2['default'].createElement(
              'span',
              { role: 'none', onClick: function onClick() {
                  return window.open('/#/notify/user-msg?type=site');
                } },
              '\u67E5\u770B\u6240\u6709\u6D88\u606F'
            ),
            _react2['default'].createElement(
              'span',
              { role: 'none', onClick: this.cleanAllMsg },
              '\u5168\u90E8\u6E05\u9664'
            )
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-sider-content' },
          _react2['default'].createElement(
            _spin2['default'],
            { spinning: inboxLoading },
            this.renderMessages(HeaderStore.getUnreadAll)
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props2 = this.props,
          AppState = _props2.AppState,
          HeaderStore = _props2.HeaderStore;
      var inboxVisible = HeaderStore.inboxVisible,
          inboxLoaded = HeaderStore.inboxLoaded,
          inboxData = HeaderStore.inboxData,
          inboxLoading = HeaderStore.inboxLoading;

      return _react2['default'].createElement(
        _react2['default'].Fragment,
        null,
        _react2['default'].createElement(
          _boot.WSHandler,
          {
            messageKey: 'choerodon:msg:site-msg:' + AppState.userInfo.id,
            onMessage: this.handleMessage
          },
          function (data) {
            return _react2['default'].createElement(
              _badge2['default'],
              { onClick: _this4.handleButtonClick, className: prefixCls, count: data || 0 },
              _react2['default'].createElement(
                _button2['default'],
                { functype: 'flat', shape: 'circle' },
                _react2['default'].createElement(_icon2['default'], { type: 'notifications' })
              )
            );
          }
        ),
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-sider ' + (inboxVisible ? prefixCls + '-sider-visible' : '') },
          this.renderPopoverContent(inboxData, inboxLoading)
        )
      );
    }
  }]);
  return Inbox;
}(_react.Component)) || _class) || _class);
exports['default'] = Inbox;