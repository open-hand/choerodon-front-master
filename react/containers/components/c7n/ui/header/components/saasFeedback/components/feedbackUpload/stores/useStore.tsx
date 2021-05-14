import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({

  }));
}

export type MainStoreProps = ReturnType<typeof useStore>;
