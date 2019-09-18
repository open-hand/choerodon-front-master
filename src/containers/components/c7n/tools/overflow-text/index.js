import React from 'react';
import './index.less';

const OverflowText = ({ text, rowCount = 2, size = '16px', lineHeight = '21px', ...props }) => {
  // const wrapHeight = lineHeight * rowCount;
  const wrapHeight = '40px';

  return (
    <div className="wrap" style={{ lineHeight, height: wrapHeight }}>
      <i className="wrap-before" style={{ height: wrapHeight }} />
      <div className="text">{text}</div>
      <i className="wrap-after" style={{ height: lineHeight, top: `-${lineHeight}` }}>...</i>
    </div>  
  );
};

export default OverflowText;
