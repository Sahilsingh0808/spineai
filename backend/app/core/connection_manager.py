from __future__ import annotations

from typing import Dict, List
from fastapi import WebSocket, WebSocketDisconnect
import uuid


class ConnectionManager:
    """Keep track of live WebSocket clients and broadcast events."""

    def __init__(self) -> None:
        self._connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket) -> str:
        """Accept the handshake and register the socket. Returns a client‑id."""
        await websocket.accept()
        client_id = str(uuid.uuid4())
        self._connections[client_id] = websocket
        return client_id

    def disconnect(self, client_id: str) -> None:
        self._connections.pop(client_id, None)

    async def broadcast(self, message: dict, *, exclude: List[str] | None = None) -> None:
        """
        Send *message* to every connected client except those in *exclude*.
        Removes sockets that have already closed.

        Handles both:
        • WebSocketDisconnect – normal disconnect
        • RuntimeError – “Unexpected ASGI message 'websocket.send'” when a
            socket closed between loop iterations.
        """
        exclude = exclude or []
        to_remove: list[str] = []

        for cid, socket in self._connections.items():
            if cid in exclude:
                continue
            try:
                await socket.send_json(message)
            except (WebSocketDisconnect, RuntimeError):
                to_remove.append(cid)

        for cid in to_remove:
            self.disconnect(cid)