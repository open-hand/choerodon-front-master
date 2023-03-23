import React, {
  useEffect, createContext, useContext, useState,
} from 'react';

import axios from '@/components/axios';
import AppState from '@/containers/stores/c7n/AppState';
import { Response, GuideDTO } from '../model';

interface ContextProps {
  guides:any,
}

const Store = createContext<ContextProps>({} as ContextProps);

export default function useStore() {
  return useContext(Store);
}

export function StoreProvider({ children }:{children:React.ReactNode}) {
  const [guides, setGuides] = useState<GuideDTO[]>([]);

  const fetchData = async () => {
    let res;
    try {
      res = (await axios.get('/cbase/choerodon/v1/guides/all', {
        params: {
          organization_id: AppState.currentMenuType?.organizationId,
        },
      })) as unknown as Response<GuideDTO>;
    } catch (err) {
      window.console.log('request failed:', err);
    }

    if (!res?.content) return;

    setGuides(res.content);
  };

  useEffect(() => {
    // fetchData();
  }, []);

  const value = {
    guides,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}

export function whithStoreProvider(Component: React.FC) {
  return (props: any) => <StoreProvider><Component {...props} /></StoreProvider>;
}
