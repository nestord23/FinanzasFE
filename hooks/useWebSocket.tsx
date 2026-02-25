'use client';

import { useState, useEffect, useRef } from 'react';
import { Accion } from '@/lib/api';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

interface UseWebSocketOptions {
  onMessage?: (data: Accion[]) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  connected: boolean;
  precios: Accion[];
  reconnect: () => void;
}

export function useWebSocket({
  onMessage,
  onConnect,
  onDisconnect,
  reconnectAttempts = 5,
  reconnectInterval = 3000,
}: UseWebSocketOptions = {}): UseWebSocketReturn {
  const [connected, setConnected] = useState(false);
  const [precios, setPrecios] = useState<Accion[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const optionsRef = useRef({ reconnectAttempts, reconnectInterval });

  useEffect(() => {
    optionsRef.current = { reconnectAttempts, reconnectInterval };
  }, [reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    if (!WS_URL) {
      console.error('WebSocket URL no configurada');
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      attemptsRef.current = 0;
      onConnect?.();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'precios' && Array.isArray(message.data)) {
          setPrecios(message.data);
          onMessage?.(message.data);
        }
      } catch (error) {
        console.error('Error al parsear mensaje WebSocket:', error);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      onDisconnect?.();

      if (attemptsRef.current < optionsRef.current.reconnectAttempts) {
        attemptsRef.current += 1;
        setTimeout(() => {
          if (wsRef.current) {
            wsRef.current.close();
          }
          const newWs = new WebSocket(WS_URL);
          wsRef.current = newWs;
        }, optionsRef.current.reconnectInterval);
      }
    };

    ws.onerror = () => {
      // Silencioso - WebSocket no disponible en producción
    };

    return () => {
      ws.close();
    };
  }, [onMessage, onConnect, onDisconnect]);

  const reconnect = () => {
    attemptsRef.current = 0;
    if (wsRef.current) {
      wsRef.current.close();
    }
    window.location.reload();
  };

  return { connected, precios, reconnect };
}
