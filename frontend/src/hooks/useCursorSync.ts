import { useEffect, useRef, useState } from "react";
import { connect, sendMove } from "../services/websocket";
import { CursorMove, RemoteUser } from "../types";

export interface ServerMove {
  type: "move";
  clientId: string;
  name: string;
  x: number;
  y: number;
  inCard: boolean;
}
export interface ServerJoin {
  type: "join";
  clientId: string;
  name: string;
}
export interface ServerLeave {
  type: "leave";
  clientId: string;
}

type ServerMessage = ServerMove | ServerJoin | ServerLeave;

export function useCursorSync(wsUrl: string) {
  const [users, setUsers] = useState<Record<string, RemoteUser>>({});
  const [hoveredUsers, setHoveredUsers] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = connect(wsUrl, (msg: ServerMessage) => {
      setUsers((prev) => handleMsg(prev, msg));

      if (msg.type === "move") {
        setHoveredUsers((prev) => {
          const next = new Set(prev);
          if (msg.inCard) next.add(msg.name);
          else next.delete(msg.name);
          return Array.from(next);
        });
      }
    });

    function handleMouse(e: MouseEvent) {
      const rect = cardRef.current?.getBoundingClientRect();
      const inCard =
        !!rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      sendMove({ x: e.clientX, y: e.clientY, inCard });
    }

    window.addEventListener("mousemove", handleMouse);
    return () => {
      ws.close();
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [wsUrl]);

  return { users, cardRef: cardRef as React.RefObject<HTMLDivElement>, hoveredUsers };
}

function handleMsg(prev: Record<string, RemoteUser>, msg: any) {
  const copy = { ...prev };
  switch (msg.type) {
    case "join":
      copy[msg.clientId] = {
        clientId: msg.clientId,
        name: msg.name,
        x: 0,
        y: 0,
        inCard: false,
        color: randomColor(),
      };
      break;
    case "move": {
        const inside =
        (msg as any).inCard ?? (msg as any).in_card ?? false;
        console.log("inside", inside, msg.inCard);

    const prev = copy[msg.clientId] ?? {
        clientId: msg.clientId,
        name: msg.name,
        color: randomColor(),
        x: 0,
        y: 0,
        inCard: false,
    };

    copy[msg.clientId] = {
        ...prev,
        x: msg.x,
        y: msg.y,
        inCard: inside,
    };
    break;
    }
    case "leave":
      delete copy[msg.clientId];
      break;
  }
  return copy;
}

const randomColor = () =>
  "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");