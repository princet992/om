import { useCallback, useEffect, useState } from "react";

import { fetchCollections } from "@/services/devotionalApi";
import type { DevotionalCollections } from "@/types/devotional";

const emptyCollections: DevotionalCollections = {
  aarti: [],
  chalisa: [],
  strotam: [],
};

export const useDevotionalData = () => {
  const [data, setData] = useState<DevotionalCollections>(emptyCollections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCollections();
      setData(response);
      setLastFetched(Date.now());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error while fetching data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    lastFetched,
    refetch: load,
  };
};

