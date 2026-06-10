import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useCollection<T extends { id: string }>(name: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, name),
      snap => {
        setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)));
        setLoading(false);
      },
      _err => { setLoading(false); }
    );
    return unsub;
  }, [name]);

  return { data, loading };
}
