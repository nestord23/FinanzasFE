'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getMiPerfil, getMisPosiciones, getMisOrdenes, Perfil, Posicion, Orden } from '@/lib/api';

const CACHE_DURATION = 30000;

interface DashboardData {
  perfil: Perfil | null;
  posiciones: Posicion[];
  ordenes: Orden[];
}

let cache: { data: DashboardData | null; timestamp: number; promise: Promise<void> | null } = {
  data: null,
  timestamp: 0,
  promise: null,
};

export function useDashboardData() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(!cache.data);
  const [error, setError] = useState('');
  const fetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (cache.promise) return cache.promise;

    cache.promise = (async () => {
      try {
        const [perfilData, posicionesData, ordenesData] = await Promise.all([
          getMiPerfil(),
          getMisPosiciones(),
          getMisOrdenes(5),
        ]);

        const data = { perfil: perfilData, posiciones: posicionesData, ordenes: ordenesData };
        cache = { data, timestamp: Date.now(), promise: null };

        setPerfil(perfilData);
        setPosiciones(posicionesData);
        setOrdenes(ordenesData);
        setError('');
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
        cache.promise = null;
      }
    })();

    return cache.promise;
  }, []);

  useEffect(() => {
    const isStale = Date.now() - cache.timestamp > CACHE_DURATION;

    if (cache.data && !isStale) {
      setPerfil(cache.data.perfil);
      setPosiciones(cache.data.posiciones);
      setOrdenes(cache.data.ordenes);
      setLoading(false);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchData();
  }, [fetchData]);

  return { perfil, posiciones, ordenes, loading, error, refresh: fetchData };
}
