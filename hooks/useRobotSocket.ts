import { useCallback, useRef, useState } from 'react';

export type RobotConnectionStatus = 'offline' | 'connecting' | 'online';

export function useRobotSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<RobotConnectionStatus>('offline');

  const connect = useCallback(() => {
    const current = socketRef.current;
    if (
      current?.readyState === WebSocket.OPEN ||
      current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    setStatus('connecting');
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      if (socketRef.current !== socket) {
        socket.close();
        return;
      }
      setStatus('online');
      console.log('[MOBO WS] conectado');
    };

    socket.onmessage = (event) => {
      if (socketRef.current !== socket) return;
      console.log('[MOBO WS MESSAGE]', event.data);
    };

    socket.onerror = (error) => {
      if (socketRef.current !== socket) return;
      console.log('[MOBO WS ERROR]', error);
      setStatus('offline');
    };

    socket.onclose = () => {
      if (socketRef.current !== socket) return;
      socketRef.current = null;
      setStatus('offline');
      console.log('[MOBO WS] desconectado');
    };
  }, [url]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    socketRef.current = null;
    setStatus('offline');
    socket?.close();
  }, []);

  const sendCommand = useCallback((command: string) => {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ command, timestamp: Date.now() }));
      return;
    }

    console.log('[MOBO WS MOCK]', command);
  }, []);

  return { status, connect, disconnect, sendCommand };
}
