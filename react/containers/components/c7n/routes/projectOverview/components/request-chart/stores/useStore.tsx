import { useLocalStore } from 'mobx-react-lite';

export default function useStore() {
  return useLocalStore(() => ({
  }));
}

export type StoreProps = ReturnType<typeof useStore>;