from fastapi import APIRouter, WebSocket
from ..core.connection_manager import ConnectionManager
from ..schemas import CursorPayload
import random

router = APIRouter()
manager = ConnectionManager()

ADJECTIVES = [
    "Brave",
    "Calm",
    "Swift",
    "Sunny",
    "Bright",
    "Witty",
    "Lucky",
]
ANIMALS = [
    "Lion",
    "Tiger",
    "Otter",
    "Falcon",
    "Panda",
    "Koala",
    "Shark",
]


def random_name() -> str:
    return f"{random.choice(ADJECTIVES)}{random.choice(ANIMALS)}"


@router.websocket("/cursor")
async def cursor_ws(socket: WebSocket):
    """Broadcast joined/left events and cursor moves."""

    client_id = await manager.connect(socket)
    user_name = random_name()
    await manager.broadcast({"type": "join", "clientId": client_id, "name": user_name})

    try:
        while True:
            raw = await socket.receive_json()
            data = CursorPayload(**raw)
            await manager.broadcast(
                {
                    "type": "move",
                    "clientId": client_id,
                    "name": user_name,
                    **data.model_dump(),
                    "in_card": data.inCard,
                }
            )
    finally:
        manager.disconnect(client_id)
        await manager.broadcast({"type": "leave", "clientId": client_id})