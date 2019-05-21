'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class, _class2, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Mask = require('./Mask');

var _Mask2 = _interopRequireDefault(_Mask);

require('./style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AutoGuide = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _mobxReact.observer)(_class = (_temp2 = _class2 = function (_Component) {
  (0, _inherits3['default'])(AutoGuide, _Component);

  function AutoGuide() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, AutoGuide);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AutoGuide.__proto__ || Object.getPrototypeOf(AutoGuide)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      current: -1,
      timer: null
    }, _this.checkSiteLevel = function () {
      var _this$props = _this.props,
          AppState = _this$props.AppState,
          siteLevel = _this$props.siteLevel;

      if (siteLevel) {
        return siteLevel === AppState.menuType.type || !AppState.menuType.type;
      }
      return true;
    }, _this.checkRoute = function () {
      var route = _this.props.route;
      // const { hash } =

      if (route) {
        return route === document.location.hash.substring(1, document.location.hash.indexOf('?') === -1 ? document.location.hash.length : document.location.hash.indexOf('?'));
      }
      return true;
    }, _this.checkIsClickable = function () {
      return _this.checkRoute() && _this.checkSiteLevel();
    }, _this.execGuide = function () {
      var current = _this.state.current;
      var _this$props2 = _this.props,
          highLight = _this$props2.highLight,
          mode = _this$props2.mode,
          idx = _this$props2.idx;

      if (mode[current + 1] === 'click') document.getElementsByClassName(highLight[current])[idx[current]].click();
      _this.setState({
        current: current + 1
      });
    }, _this.handleStart = function () {
      var _this$props3 = _this.props,
          time = _this$props3.time,
          onStart = _this$props3.onStart;

      if (onStart) onStart();
      if (_this.checkIsClickable()) {
        _this.execGuide();
        var timer = setInterval(function () {
          var current = _this.state.current;
          var highLight = _this.props.highLight;

          if (current < highLight.length - 1) {
            _this.execGuide();
          } else {
            clearInterval(_this.state.timer);
          }
        }, time);
        _this.setState({ timer: timer });
      }
    }, _this.getMasks = function () {
      var _this$props4 = _this.props,
          highLight = _this$props4.highLight,
          idx = _this$props4.idx,
          level = _this$props4.level,
          mode = _this$props4.mode;
      var current = _this.state.current;

      return highLight.map(function (v, i) {
        return _react2['default'].createElement(_Mask2['default'], {
          highLight: highLight[i],
          idx: idx[i] || 0,
          level: level[i] || 0,
          mode: mode[i],
          visible: current === i && mode[i] !== 'click',
          onEnter: _this.handleFinalClick,
          onLeave: _this.handleFinalClick
        });
      });
    }, _this.handleFinalClick = function () {
      var timer = _this.state.timer;

      if (timer) clearInterval(timer);
      _this.setState({
        current: -1
      });
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(AutoGuide, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return _react2['default'].createElement(
        _react2['default'].Fragment,
        null,
        _react2['default'].createElement(
          'a',
          { onClick: this.handleStart },
          ' ',
          children,
          ' '
        ),
        this.getMasks()
      );
    }
  }]);
  return AutoGuide;
}(_react.Component), _class2.defaultProps = {
  visible: false,
  highLight: [],
  idx: [],
  level: [],
  mode: ['mask'],
  time: 1000
}, _class2.propTypes = {
  visible: _propTypes2['default'].bool,
  highLight: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  idx: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
  level: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
  mode: _propTypes2['default'].arrayOf(_propTypes2['default'].string),
  time: _propTypes2['default'].number,
  route: _propTypes2['default'].string,
  siteLevel: _propTypes2['default'].string,
  onLeave: _propTypes2['default'].func,
  onEnter: _propTypes2['default'].func,
  onStart: _propTypes2['default'].func
}, _temp2)) || _class) || _class);
exports['default'] = AutoGuide;