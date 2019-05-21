'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports['default'] = asyncModuleWrapper;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobxReact = require('mobx-react');

var _Observable = require('rxjs/Observable');

var _Subject = require('rxjs/Subject');

var _esModule = require('./esModule');

var _esModule2 = _interopRequireDefault(_esModule);

require('rxjs/add/operator/map');

require('rxjs/add/operator/takeUntil');

require('rxjs/add/observable/zip');

require('rxjs/add/observable/of');

require('rxjs/add/observable/fromPromise');

var _moduleWrapper = require('../pro/moduleWrapper');

var _moduleWrapper2 = _interopRequireDefault(_moduleWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function asyncModuleWrapper(getComponent, getInjects, extProps, moduleCode, getAxios) {
  return function (_Component) {
    (0, _inherits3['default'])(AsyncModuleWrapper, _Component);

    function AsyncModuleWrapper() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3['default'])(this, AsyncModuleWrapper);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AsyncModuleWrapper.__proto__ || Object.getPrototypeOf(AsyncModuleWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        Cmp: null,
        injects: {}
      }, _this.componentWillUnmountSubject = new _Subject.Subject(), _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }

    (0, _createClass3['default'])(AsyncModuleWrapper, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        var subject = this.componentWillUnmountSubject;
        var streams = [];
        if (getComponent) {
          streams.push(_Observable.Observable.fromPromise(getComponent()).map(_esModule2['default']).takeUntil(subject));
        }
        if (getInjects) {
          if (typeof getInjects === 'function') {
            streams.push(_Observable.Observable.fromPromise(getInjects()).map(_esModule2['default']).map(function (inject) {
              if (inject.getStoreName) {
                return (0, _defineProperty3['default'])({}, inject.getStoreName(), inject);
              }
              return {};
            }).takeUntil(subject));
          } else if ((typeof getInjects === 'undefined' ? 'undefined' : (0, _typeof3['default'])(getInjects)) === 'object') {
            Object.keys(getInjects).forEach(function (key) {
              streams.push(_Observable.Observable.fromPromise(getInjects[key]()).map(_esModule2['default']).map(function (inject) {
                return (0, _defineProperty3['default'])({}, key, inject);
              }).takeUntil(subject));
            });
          }
        }
        if (streams.length > 0) {
          _Observable.Observable.zip.apply(_Observable.Observable, streams).takeUntil(subject).subscribe(function (_ref4) {
            var _ref5 = (0, _toArray3['default'])(_ref4),
                Cmp = _ref5[0],
                injects = _ref5.slice(1);

            _this2.setState({ Cmp: Cmp, injects: injects });
            subject.unsubscribe();
          });
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var subject = this.componentWillUnmountSubject;
        if (subject && !subject.closed) {
          subject.next();
          subject.unsubscribe();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _state = this.state,
            Cmp = _state.Cmp,
            injects = _state.injects;


        return Cmp ? _react2['default'].createElement(
          _moduleWrapper2['default'],
          { moduleCode: moduleCode },
          _react2['default'].createElement(
            _mobxReact.Provider,
            { getAxios: getAxios },
            _react2['default'].createElement(Cmp, _extends3['default'].apply(undefined, [{}, extProps, this.props].concat((0, _toConsumableArray3['default'])(injects))))
          )
        ) : null;
      }
    }]);
    return AsyncModuleWrapper;
  }(_react.Component);
}