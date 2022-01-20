import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({

  }));
}

export type C7NStoreProps = ReturnType<typeof useStore>;
