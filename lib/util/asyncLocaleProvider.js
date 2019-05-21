'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports['default'] = asyncLocaleProvider;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _Observable = require('rxjs/Observable');

var _Subject = require('rxjs/Subject');

var _esModule = require('./esModule');

var _esModule2 = _interopRequireDefault(_esModule);

require('rxjs/add/operator/map');

require('rxjs/add/operator/takeUntil');

require('rxjs/add/observable/zip');

require('rxjs/add/observable/of');

require('rxjs/add/observable/fromPromise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function asyncLocaleProvider(locale, getMessage, getLocaleData) {
  return function (_Component) {
    (0, _inherits3['default'])(AsyncLocaleProvider, _Component);

    function AsyncLocaleProvider() {
      var _ref;

      var _temp, _this, _ret;

      (0, _classCallCheck3['default'])(this, AsyncLocaleProvider);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = AsyncLocaleProvider.__proto__ || Object.getPrototypeOf(AsyncLocaleProvider)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        message: null,
        localeData: null
      }, _this.componentWillUnmountSubject = new _Subject.Subject(), _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
    }

    (0, _createClass3['default'])(AsyncLocaleProvider, [{
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        var subject = this.componentWillUnmountSubject;
        var streams = [];
        if (getMessage) {
          streams.push(_Observable.Observable.fromPromise(getMessage()).map(_esModule2['default']).takeUntil(subject));
        }
        if (getLocaleData) {
          streams.push(_Observable.Observable.fromPromise(getLocaleData()).map(_esModule2['default']).takeUntil(subject));
        }
        if (streams.length > 0) {
          _Observable.Observable.zip.apply(_Observable.Observable, streams).takeUntil(subject).subscribe(function (_ref2) {
            var _ref3 = (0, _slicedToArray3['default'])(_ref2, 2),
                messages = _ref3[0],
                localeData = _ref3[1];

            if (localeData) {
              (0, _reactIntl.addLocaleData)(localeData);
            }
            _this2.setState({ messages: messages, localeData: localeData });
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
        var messages = this.state.messages;

        return messages ? _react2['default'].createElement(_reactIntl.IntlProvider, (0, _extends3['default'])({}, this.props, { locale: locale.replace('_', '-'), messages: messages })) : null;
      }
    }]);
    return AsyncLocaleProvider;
  }(_react.Component);
}