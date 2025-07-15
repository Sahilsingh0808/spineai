// websocket.ts
import { CursorMove } from "../types";

let socket: WebSocket | null = null;

/**
 * Connect once and reuse the same WebSocket instance.
 * Generic so the caller can decide the message shape.
 */
export function connect<T = unknown>(
  url: string,
  onMessage: (msg: T) => void
) {
  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(url);
  socket.onmessage = (e) => onMessage(JSON.parse(e.data));
  return socket;
}

export function sendMove(move: CursorMove) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(move));
  }
}