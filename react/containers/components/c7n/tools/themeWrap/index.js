import React from 'react';
import { inject } from 'mobx-react';

export default inject('AppState')((props) => {
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
    Object.entries(map).forEach((item) => {
      result[item[0]] = item[1][theme];
    });
    result.styles = map?.style[AppState.getCurrentTheme] || null;

    return result;
  };

  return React.Children.map(children, (child) => React.cloneElement(child, renderParams()));
});
