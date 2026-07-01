'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Accion } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UseSSEOptions {
  token: string | null;
  onMessage?: (data: Accion[]) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

interface UseSSEReturn {
  connected: boolean;
  precios: Accion[];
  reconnect: () => void;
}

export function useSSE({
  token,
  onMessage,
  onConnect,
  onDisconnect,
}: UseSSEOptions): UseSSEReturn {
  const [connected, setConnected] = useState(false);
  const [precios, setPrecios] = useState<Accion[]>([]);
  const sourceRef = useRef<EventSource | null>(null);
  const mountedRef = useRef(true);

  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  onMessageRef.current = onMessage;
  onConnectRef.current = onConnect;
  onDisconnectRef.current = onDisconnect;

  const cleanup = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    cleanup();

    if (!API_URL || !token) return;

    const url = `${API_URL}/api/eventos?token=${encodeURIComponent(token)}`;

    const source = new EventSource(url);
    sourceRef.current = source;

    source.onmessage = (event) => {
      if (!mountedRef.current) return;
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'auth_ok') {
          setConnected(true);
          onConnectRef.current?.();
        } else if (message.type === 'precios' && Array.isArray(message.data)) {
          setPrecios(message.data);
          onMessageRef.current?.(message.data);
        }
      } catch {
        // ignorar datos malformados
      }
    };

    source.onerror = () => {
      if (!mountedRef.current) return;
      setConnected(false);
      onDisconnectRef.current?.();
    };
  }, [token, cleanup]);

  useEffect(() => {
    mountedRef.current = true;

    connect();

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [connect, cleanup]);

  const reconnect = useCallback(() => {
    if (mountedRef.current) {
      connect();
    }
  }, [connect]);

  return { connected, precios, reconnect };
}
