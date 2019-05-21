'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RenderInBody = function (_Component) {
  (0, _inherits3['default'])(RenderInBody, _Component);

  function RenderInBody() {
    (0, _classCallCheck3['default'])(this, RenderInBody);
    return (0, _possibleConstructorReturn3['default'])(this, (RenderInBody.__proto__ || Object.getPrototypeOf(RenderInBody)).apply(this, arguments));
  }

  (0, _createClass3['default'])(RenderInBody, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // 新建一个div标签并塞进body
      this.popup = document.createElement('div');
      document.body.appendChild(this.popup);
      this.renderLayer();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.renderLayer();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // 在组件卸载的时候，保证弹层也被卸载掉
      _reactDom2['default'].unmountComponentAtNode(this.popup);
      document.body.removeChild(this.popup);
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer() {
      // 将弹层渲染到body下的div标签
      _reactDom2['default'].render(this.props.children, this.popup);
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);
  return RenderInBody;
}(_react.Component);

exports['default'] = RenderInBody;