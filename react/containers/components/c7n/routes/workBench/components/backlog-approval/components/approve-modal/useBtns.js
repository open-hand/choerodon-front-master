import { useEffect, useState, useCallback } from 'react';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom';
import axios from '@/containers/components/c7n/tools/axios';

const useBtns = () => {
  const [loading, setLoading] = useState(true);
  const [btns, setBtns] = useState([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await axios.get('/agile/v1/projects/1528/schemes/query_status_by_project_id?apply_type=backlog');
    batchedUpdates(() => {
      setBtns(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading, btns,
  };
};

const Btns = ({ children }) => {
  const data = useBtns();
  return children(data);
};

export { Btns };
export default useBtns;
