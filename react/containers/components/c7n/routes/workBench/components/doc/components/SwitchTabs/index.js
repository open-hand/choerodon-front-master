import React from 'react';
import { observer } from 'mobx-react-lite';
import { useDoc } from '../../stores';

const Switch = () => {
  const {
    clsPrefix,
    docStore,
    opts,
  } = useDoc();

  const {
    setSelfDoc,
    getSelfDoc,
  } = docStore;

  const onClick = (v) => {
    setSelfDoc(v);
  };

  return (
    <ul className={`${clsPrefix}-switch`}>
      {opts.map((option, index) => (
        <>
          <li
            onClick={(e) => {
              e.preventDefault();
              onClick(option.value);
            }}
            role="none"
            className={getSelfDoc === option.value ? `${clsPrefix}-switch-active` : `${clsPrefix}-switch-li`}
          >
            {option.text || option}
          </li>
          <span className="line" />
        </>
      ))}
    </ul>
  );
};

export default observer(Switch);
