import { useLocation } from 'react-router-dom';

export default function useQueryString() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  // @ts-ignore
  const params = Object.fromEntries(urlParams);
  return params;
}
