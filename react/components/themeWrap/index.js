import React from 'react';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

export default inject('AppState')(observer((props) => {
  const {
    map,
    children,
    AppState,
  } = props;

  let theme;
  switch (AppState.getCurrentTheme) {
    case '':
      theme = 'origin';
      break;
    case 'theme4':
      theme = 'theme4';
      break;
    default:
      theme = 'origin';
      break;
  }

  const renderParams = () => {
    const result = {};
    if (map && map.key) {
      Object.entries(map.key).forEach((item) => {
        result[item[0]] = item[1][theme];
      });
    }
    if (map && map.style) {
      result.styles = map?.style[AppState.getCurrentTheme] || null;
    }

    return result;
  };

  return React.Children.map(children, (child) => React.cloneElement(child, renderParams()));
}));
