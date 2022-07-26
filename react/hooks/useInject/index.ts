import React, { useState, useEffect } from 'react';
import { get, getMap } from '@choerodon/inject';

const useInject = ({
  prefix,
  idList,
}: {
    prefix?: string,
    idList?: string[],
}) => {
  const [injectList, setInjectList] = useState({});

  const setInjectListByPrefix = (list: any[]) => {
    const inside = list;
    if (prefix) {
      const injectMap = getMap();
      injectMap.forEach((value: any, key: any) => {
        if (key.startsWith(prefix)) {
          inside[key] = value;
        }
      });
    }
    return inside;
  };

  const setInjectListByids = (list: any[]) => {
    const inside = list;
    if (idList) {
      const injectMap = getMap();
      idList.forEach((id: any) => {
        const value = injectMap.get(id);
        if (value) {
          inside[id] = value;
        }
      });
    }
    return inside;
  };

  useEffect(() => {
    const list: any = {};
    const newList = setInjectListByPrefix(list);
    const finalList = setInjectListByids(newList);
    setInjectList(finalList);
  }, []);

  return [injectList];
};

export default useInject;
