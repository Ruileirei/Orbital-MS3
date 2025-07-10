import { fetchAllStallsFromFirestore } from '@/services/stallService';
import { useEffect, useState } from 'react';

interface Stall {
  id: string;
  title: string;
  cuisine: string;
  rating: number;
  openingHours: { [key: string]: string[] };
  latitude: number;
  longitude: number;
  menu: string[];
}

export function useStalls() {
  const [loading, setLoading] = useState(true);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStalls() {
      try {
        const data = await fetchAllStallsFromFirestore();
        if (isMounted) {
          setStalls(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching stalls:', err);
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadStalls();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, stalls, error };
}

