import { Cursor } from "../components/Cursor";
import { Card } from "../components/Card";
import { useCursorSync } from "../hooks/useCursorSync";

export default function Home() {
  const { users, cardRef, hoveredUsers } = useCursorSync(
    "ws://localhost:8000/ws/cursor"
  );
  const list = Object.values(users);

  return (
    <main
      style={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f0f4ff 0%, #e1ecff 50%, #fdfdff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Card
        cardRef={cardRef}
        usersInCard={list.filter((u) => u.inCard)}
        hoveredUsers={hoveredUsers}
      />
      {list.map((u) => (
        <Cursor key={u.clientId} user={u} />
      ))}
    </main>
  );
}
