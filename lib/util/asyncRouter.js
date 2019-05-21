'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports['default'] = asyncRouter;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mobx = require('mobx');

var _mobxReact = require('mobx-react');

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _Observable = require('rxjs/Observable');

var _Subject = require('rxjs/Subject');

var _esModule = require('./esModule');

var _esModule2 = _interopRequireDefault(_esModule);

require('rxjs/add/operator/map');

require('rxjs/add/operator/takeUntil');

require('rxjs/add/observable/zip');

require('rxjs/add/observable/of');

require('rxjs/add/observable/fromPromise');

var _AsyncCmpWrap = require('./AsyncCmpWrap');

var _AsyncCmpWrap2 = _interopRequireDefault(_AsyncCmpWrap);

var _stores = require('../../stores');

var _stores2 = _interopRequireDefault(_stores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var MenuStore = _stores2['default'].MenuStore;


var refreshKey = '__refresh__';

function asyncRouter(getComponent, getInjects) {
  var extProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var AsyncRoute = function (_Component) {
    (0, _inherits3['default'])(AsyncRoute, _Component);

    function AsyncRoute() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3['default'])(this, AsyncRoute);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AsyncRoute.__proto__ || Object.getPrototypeOf(AsyncRoute)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        Cmp: null,
        injects: {}
      }, _this.initKey = Date.now(), _this.cacheKey = extProps[refreshKey] ? null : _this.props.history.location.pathname, _this.componentWillUnmountSubject = new _Subject.Subject(), _this.renderChild = function () {
        var _this$state = _this.state,
            Cmp = _this$state.Cmp,
            injects = _this$state.injects;

        return _react2['default'].createElement(Cmp, (0, _extends3['default'])({}, (0, _omit2['default'])(extProps, [refreshKey, 'axios']), _this.props, _extends3['default'].apply(undefined, [{}].concat((0, _toConsumableArray3['default'])(injects))), { key: _this.initKey }));
      }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }

    (0, _createClass3['default'])(AsyncRoute, [{
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
        var Cmp = this.state.Cmp;

        var key = MenuStore.contentKeys ? (0, _mobx.get)(MenuStore.contentKeys, this.cacheKey) : undefined;
        var props = {
          shouldUpdate: extProps[refreshKey]
        };
        if (key && key !== this.initKey) {
          this.initKey = key;
          props.shouldUpdate = true;
        }
        var axiosProps = {};
        if (extProps.axios) {
          axiosProps = { axios: extProps.axios };
        }
        return Cmp && _react2['default'].createElement(
          _AsyncCmpWrap2['default'],
          props,
          _react2['default'].createElement(
            _mobxReact.Provider,
            axiosProps,
            this.renderChild()
          )
        );
      }
    }]);
    return AsyncRoute;
  }(_react.Component);

  return (0, _mobxReact.observer)(AsyncRoute);
}