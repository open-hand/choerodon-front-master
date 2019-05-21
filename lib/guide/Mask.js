'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tooltip = require('choerodon-ui/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class, _class2, _temp, _initialiseProps;

require('choerodon-ui/lib/tooltip/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mobxReact = require('mobx-react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _RenderInBody = require('./RenderInBody');

var _RenderInBody2 = _interopRequireDefault(_RenderInBody);

require('./style');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var captureLock = false;

function findParent(node, level) {
  if (level > 0 && node) {
    return findParent(node.parentNode, level - 1);
  } else {
    return node;
  }
}

var Mask = (_dec = (0, _mobxReact.inject)('AppState'), _dec(_class = (0, _mobxReact.observer)(_class = (_temp = _class2 = function (_Component) {
  (0, _inherits3['default'])(Mask, _Component);

  function Mask(props) {
    (0, _classCallCheck3['default'])(this, Mask);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Mask.__proto__ || Object.getPrototypeOf(Mask)).call(this, props));

    _initialiseProps.call(_this);

    var visible = props.visible;

    _this.state = {
      visible: visible,
      clickAble: false
    };
    return _this;
  }

  (0, _createClass3['default'])(Mask, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        visible: nextProps.visible
      });
      this.setMask();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('hashchange', this.setMask);
      this.setMask();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('hashchange', this.setMask);
      window.removeEventListener('resize', this.onWindowResize);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          prefixCls = _props.prefixCls,
          className = _props.className;

      return _react2['default'].createElement(
        _react2['default'].Fragment,
        null,
        this.state.clickAble ? _react2['default'].createElement(
          'a',
          { onClick: function onClick(e) {
              return _this2.handleMaskClick(e);
            }, className: (0, _classnames2['default'])(prefixCls + '-valid', className) },
          ' ',
          children,
          ' '
        ) : _react2['default'].createElement(
          _tooltip2['default'],
          { getTooltipContainer: function getTooltipContainer(that) {
              return that;
            }, title: '\u8BF7\u6267\u884C\u4E0A\u4E00\u6B65\u64CD\u4F5C', placement: 'topLeft' },
          _react2['default'].createElement(
            'a',
            { onClick: function onClick(e) {
                return _this2.handleMaskClick(e);
              }, className: (0, _classnames2['default'])(prefixCls + '-invalid', className) },
            ' ',
            children,
            ' '
          )
        ),
        _react2['default'].createElement(
          _RenderInBody2['default'],
          null,
          this.getOverlay()
        )
      );
    }
  }]);
  return Mask;
}(_react.Component), _class2.defaultProps = {
  prefixCls: 'c7n-boot-guide-mask',
  visible: false,
  wrapperClassName: '',
  className: '',
  highLight: '',
  idx: 0,
  level: 0,
  mode: 'mask',
  route: ''
}, _class2.propTypes = {
  prefixCls: _propTypes2['default'].string,
  visible: _propTypes2['default'].bool,
  className: _propTypes2['default'].string,
  size: _propTypes2['default'].oneOf(['small', 'default', 'large']),
  wrapperClassName: _propTypes2['default'].string,
  indicator: _propTypes2['default'].node,
  highLight: _propTypes2['default'].string,
  idx: _propTypes2['default'].number,
  level: _propTypes2['default'].number,
  mode: _propTypes2['default'].string,
  route: _propTypes2['default'].string,
  siteLevel: _propTypes2['default'].string,
  onLeave: _propTypes2['default'].func,
  onEnter: _propTypes2['default'].func,
  onCheck: _propTypes2['default'].func
}, _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.setMask = function () {
    var domHighLight = findParent(document.getElementsByClassName(_this3.props.highLight)[_this3.props.idx], _this3.props.level);
    if (domHighLight) {
      var elementClient = domHighLight.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var top = elementClient.top,
          left = elementClient.left,
          width = elementClient.width,
          height = elementClient.height;

      _this3.setState({
        top: top,
        left: left,
        width: width,
        height: height,
        windowHeight: windowHeight,
        windowWidth: windowWidth,
        domHighLight: domHighLight,
        clickAble: _this3.checkIsClickable()
      });
      window.addEventListener('resize', _this3.onWindowResize);
    } else {
      _this3.setState({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        clickAble: _this3.checkIsClickable()
      });
    }
  };

  this.onWindowResize = function () {
    _this3.setMask();
  };

  this.handleEnter = function (e) {
    document.getElementsByClassName(_this3.props.highLight)[_this3.props.idx].click();
    captureLock = false;
    _this3.setState({ visible: false });
    if (_this3.props.onEnter) _this3.props.onEnter(e);
  };

  this.handleLeave = function (e) {
    _this3.setState({ visible: false });
    if (_this3.props.onLeave) _this3.props.onLeave(e);
  };

  this.handleMaskClick = function (e) {
    var _props2 = _this3.props,
        mode = _props2.mode,
        onCheck = _props2.onCheck;

    if (_this3.checkIsClickable()) {
      switch (mode) {
        case 'click':
          document.getElementsByClassName(_this3.props.highLight)[_this3.props.idx].click();
          break;
        case 'mask':
          _this3.setState({ visible: true }, function () {
            return _this3.setMask();
          });
          break;
        case 'checkMask':
          if (onCheck && onCheck(findParent(document.getElementsByClassName(_this3.props.highLight)[_this3.props.idx], _this3.props.level))) {
            _this3.setState({ visible: true }, function () {
              return _this3.setMask();
            });
          }
          break;
        default:
          _this3.setState({ visible: true }, function () {
            return _this3.setMask();
          });
          break;
      }
    }
  };

  this.checkSiteLevel = function () {
    var _props3 = _this3.props,
        AppState = _props3.AppState,
        siteLevel = _props3.siteLevel;

    if (siteLevel) {
      return siteLevel === AppState.menuType.type || !AppState.menuType.type;
    }
    return true;
  };

  this.checkRoute = function () {
    var route = _this3.props.route;
    // const { hash } =

    if (route) {
      return route === document.location.hash.substring(1, document.location.hash.indexOf('?') === -1 ? document.location.hash.length : document.location.hash.indexOf('?'));
    }
    return true;
  };

  this.checkIsClickable = function () {
    return _this3.checkRoute() && _this3.checkSiteLevel();
  };

  this.getOverlay = function () {
    var _state = _this3.state,
        top = _state.top,
        left = _state.left,
        width = _state.width,
        height = _state.height,
        windowWidth = _state.windowWidth,
        windowHeight = _state.windowHeight,
        visible = _state.visible,
        domHighLight = _state.domHighLight;


    var maskStyle = {
      borderTopWidth: top,
      borderRightWidth: windowWidth - left - width,
      borderBottomWidth: windowHeight - top - height,
      borderLeftWidth: left,
      width: 'windowWidth',
      height: 'windowHeight'
    };
    var prefixCls = _this3.props.prefixCls;

    var maskElement = _react2['default'].createElement(
      'div',
      null,
      _react2['default'].createElement('div', { className: prefixCls + '-overlay', style: { width: left, display: visible ? 'block' : 'none' }, onClick: function onClick(e) {
          return _this3.handleLeave(e);
        } }),
      _react2['default'].createElement('div', { className: prefixCls + '-overlay', style: { left: left + width, display: visible ? 'block' : 'none' }, onClick: function onClick(e) {
          return _this3.handleLeave(e);
        } }),
      _react2['default'].createElement('div', { className: prefixCls + '-overlay', style: { width: width, left: left, top: height + top, display: visible ? 'block' : 'none' }, onClick: function onClick(e) {
          return _this3.handleLeave(e);
        } }),
      _react2['default'].createElement('div', { className: prefixCls + '-overlay', style: { width: width, left: left, top: 0, height: top, display: visible ? 'block' : 'none' }, onClick: function onClick(e) {
          return _this3.handleLeave(e);
        } }),
      _react2['default'].createElement('div', { className: (0, _classnames2['default'])(prefixCls + '-clickable', visible ? prefixCls + '-border' : ''), style: maskStyle, key: 'mask' }),
      _react2['default'].createElement('div', { className: prefixCls + '-clickable-btn', style: { top: top, left: left, width: width, height: height, display: visible ? 'block' : 'none' }, onClick: function onClick(e) {
          return _this3.handleEnter(e, domHighLight);
        } })
    );
    return maskElement;
  };
}, _temp)) || _class) || _class);
exports['default'] = Mask;