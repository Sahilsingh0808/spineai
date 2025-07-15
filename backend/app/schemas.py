from pydantic import BaseModel


class CursorPayload(BaseModel):
    x: int
    y: int
    inCard: bool = False