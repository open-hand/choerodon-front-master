import React, { useEffect } from 'react';
import { CodeArea } from 'choerodon-ui/pro';
import JSONFormatter from 'choerodon-ui/pro/lib/code-area/formatters/JSONFormatter';
import './index.less';

require('codemirror/mode/javascript/javascript');

function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
}
export default function CodeShow({ value = '' }) {
  return (
    <CodeArea
      className="c7n-saga-CodeShow"
      style={{
        height: 350,
      }}
      value={value}
      name="content"
      options={{
        lineNumbers: false,
        theme: 'code-show',
      }}
      {...(isJSON(value) ? { formatter: JSONFormatter } : {})}
    />
  );
}
