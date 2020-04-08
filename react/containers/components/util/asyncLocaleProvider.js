import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import esModule from './esModule';

export default function asyncLocaleProvider(locale, getMessage, getLocaleData) {
  return class AsyncLocaleProvider extends Component {
    constructor() {
      super();
      this.state = {
        messages: null,
      };
    }

    loadData = async () => {
      const [messageData, localeData] = await Promise.all([
        getMessage ? getMessage() : null,
        getLocaleData ? getLocaleData() : null,
      ]);
      if (localeData) {
        addLocaleData(esModule(localeData));
      }
      this.setState({
        messages: esModule(messageData),
      });
    }

    componentDidMount() {
      this.loadData();
    }

    render() {
      const { messages } = this.state;
      return messages ? <IntlProvider {...this.props} locale={locale.replace('_', '-')} messages={messages} /> : null;
    }
  };
}
