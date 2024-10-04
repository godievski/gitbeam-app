import { useState, useEffect, useCallback } from "react";

export default function useGetAsyncResource<T>(
  getter: () => Promise<T>
): {
  loading: boolean;
  error: false | any;
  data: T | undefined;
  setData;
  reload();
} {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /**
   * Load the user data
   */
  const reload = useCallback(() => {
    let is_active = true;
    setLoading(true);
    const fetch = async () => {
      try {
        const loaded_data = await getter();
        if (is_active) {
          setData(loaded_data);
          setError(false);
        }
      } catch (e) {
        if (is_active) {
          setError(error);
        }
      }
      if (is_active) {
        setLoading(false);
      }
    };

    fetch();

    return () => {
      is_active = false;
    };
  }, [loading]);

  useEffect(reload, []);

  return {
    loading,
    error,
    data,
    setData,
    reload,
  };
}
