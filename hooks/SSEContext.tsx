'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { Accion } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SSEContextType {
  connected: boolean;
  precios: Accion[];
  preciosMap: Record<string, number>;
}

const SSEContext = createContext<SSEContextType>({
  connected: false,
  precios: [],
  preciosMap: {},
});

export function SSEProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [precios, setPrecios] = useState<Accion[]>([]);
  const [preciosMap, setPreciosMap] = useState<Record<string, number>>({});
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!API_URL) return;

    const source = new EventSource(`${API_URL}/api/eventos`, { withCredentials: true });
    sourceRef.current = source;

    source.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'auth_ok') {
          setConnected(true);
        } else if (message.type === 'precios' && Array.isArray(message.data)) {
          setPrecios(message.data);
          const map: Record<string, number> = {};
          message.data.forEach((a: Accion) => { map[a.id] = a.precio_actual; });
          setPreciosMap(map);
        }
      } catch {
        // ignorar datos malformados
      }
    };

    source.onerror = () => {
      setConnected(false);
    };

    return () => {
      source.close();
      sourceRef.current = null;
      setConnected(false);
    };
  }, []);

  return (
    <SSEContext.Provider value={{ connected, precios, preciosMap }}>
      {children}
    </SSEContext.Provider>
  );
}

export function useSSEContext() {
  return useContext(SSEContext);
}
