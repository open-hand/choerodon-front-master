import { useDynamicScript } from '@zknow/utils';

// eslint-disable-next-line no-underscore-dangle
const env: any = window._env_;

export default function useManifest(scope: string) {
  const url = env[scope] || `${env.STATIC_URL}/${scope}/importManifest.js`;

  const script = useDynamicScript({
    url,
  });

  return script;
}
