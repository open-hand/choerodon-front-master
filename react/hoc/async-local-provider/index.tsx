import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import esModule from '../utils/esModule';

export default function asyncLocaleProvider(locale:string, getMessage:CallableFunction):React.ComponentType {
  return class AsyncLocaleProvider extends Component<any, any> {
    constructor(props:any) {
      super(props);
      this.state = {
        messages: null,
      };
    }

    loadData = async () => {
      const [messageData] = await Promise.all([
        getMessage ? getMessage() : null,
      ]);
      this.setState({
        messages: esModule(messageData),
      });
    }

    componentDidMount() {
      this.loadData();
    }

    render() {
      const { messages } = this.state;
      return messages ? (
        <IntlProvider
          {...this.props}
          locale={locale.replace('_', '-')}
          messages={messages}
        />
      ) : null;
    }
  };
}
