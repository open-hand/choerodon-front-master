/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import { Loading } from '@choerodon/components';
import { set } from '@choerodon/inject';
import loadComponent from '@/utils/loadComponent';
import loadScrip from '@/utils/loadScript';

// eslint-disable-next-line no-underscore-dangle
const env = (window as any)._env_;

interface IProps {
  remoteResources: string[]
}

const Index:React.FC<IProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const { remoteResources, children } = props;

  useEffect(() => {
    async function fillInject(serviceName:string, resourceName:string, resourceType:string) {
      const result = loadComponent(serviceName, resourceName);
      const res = await result();

      if (resourceType === 'variable') {
        Object.keys(res).forEach((key) => {
          set(`${resourceName}-` + 'i', res[key]);
        });
      } else if (resourceType === 'comp') {
        set(resourceName, result);
      }
    }

    async function asyncFunc() {
      for (let i = 0; i < remoteResources.length; i++) {
        const str = remoteResources[i];
        const serviceName = str.split(':')[0];
        const resourceType = str.split(':')[1].split('_')[0];
        const resourceName = str;

        if (!(window as any)[serviceName]) {
          const remoteUrl = env[`remote_${serviceName}`];
          loadScrip(remoteUrl.replace('$MINIO_URL', env.MINIO_URL), () => {
            fillInject(serviceName, resourceName, resourceType);
          });
        } else {
          fillInject(serviceName, resourceName, resourceType);
        }
      }

      setLoading(false);
    }

    asyncFunc();
  }, [remoteResources]);

  return loading ? <Loading /> : <>{children}</>;
};

export default Index;
