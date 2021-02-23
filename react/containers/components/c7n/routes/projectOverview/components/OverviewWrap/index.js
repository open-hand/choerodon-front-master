import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import './index.less';

const OverviewWrap = observer((props) => {
  const {
    children,
    width,
    height,
    title,
    style,
    marginRight,
    titleMarginBottom,
  } = props;

  return (
    <div
      className="c7n-project-overview-wrap"
      style={{
        width,
        height,
        marginRight,
        ...style,
      }}
    >
      {children}
    </div>
  );
});
OverviewWrap.Header = function Header({ style, titleMarginBottom, title, children }) {
  const renderTitleRight = () => {

  };
  return (
    <div style={{
      marginBottom: titleMarginBottom || 10,
      display: 'flex',
      justifyContent: 'space-between',
      ...style,
    }}
    >
      <span className="c7n-project-overview-wrap-title">{title}</span>
      <div className="c7n-project-overview-wrap-title-right">{children}</div>
    </div>
  );
};
OverviewWrap.Switch = function Switch({
  options: propsOption, children, onChange, defaultValue, checkedValue,
}) {
  const [value, setValue] = useState(defaultValue || 0);
  const [options, setOptions] = useState(propsOption || []);
  const onClick = (v) => {
    setValue(v);
    if (onChange) {
      onChange(v);
    }
  };
  useEffect(() => {
    if (!Array.isArray(options)) {
      setOptions([]);
    } else if (!options.some((v) => v.value)) {
      setOptions(options.map((v, index) => ({ text: v, value: index })));
    }
    propsOption = options;
  }, []);

  return (
    <ul className="c7n-project-overview-wrap-switch">
      {options.map((option, index) => (
        <>
          <li
            onClick={(e) => {
              e.preventDefault();
              onClick(option.value);
            }}
            role="none"
            className={value === option.value ? 'c7n-project-overview-wrap-switch-active' : 'c7n-project-overview-wrap-switch-li'}
          >
            {option.text || option}
          </li>
          <span className="line" />
        </>
      ))}
    </ul>
  );
};
OverviewWrap.Content = function Content({ className, children, ...restProps }) {
  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
};
export default OverviewWrap;
