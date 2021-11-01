import { useLocation } from 'react-router-dom';

export default function useQueryString() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  // @ts-expect-error
  const params = Object.fromEntries(urlParams);
  return params;
}
