/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import './index.less';

const clsPrefix = 'c7n-workbench-multiple';
function Switch({
  options: propsOption, children, onChange, defaultValue, checkedValue, value: propsValue,
}) {
  const [value, setValue] = useState(defaultValue);
  const [options, setOptions] = useState(propsOption || []);
  const onClick = (v) => {
    if (typeof (onChange) !== 'undefined') {
      const changeResult = onChange(v);
      typeof (changeResult) !== 'undefined' && changeResult && setValue(v);
    } else {
      setValue(v);
    }
  };
  useEffect(() => {
    if (propsValue && options.some((v) => v.value === propsValue)) {
      setValue(propsValue);
      // onClick(propsValue);
    }
  }, [options, propsValue]);
  useEffect(() => {
    if (!Array.isArray(options)) {
      setOptions([]);
    } else if (!options.some((v) => v.value)) {
      setOptions(options.map((v, index) => ({ text: v, value: index })));
    }
    // eslint-disable-next-line no-param-reassign
    propsOption = options;
  }, []);

  return (
    <ul className={`${clsPrefix}-switch`}>
      {options.map((option, index) => (
        <>
          <li
            role="none"
            onClick={(e) => {
              e.preventDefault();
              onClick(option.value);
            }}
            className={value === option.value ? `${clsPrefix}-switch-active` : `${clsPrefix}-switch-li`}
          >
            {option.text || option}
          </li>
          <span className="line" />
        </>
      ))}
    </ul>
  );
}
export default Switch;
