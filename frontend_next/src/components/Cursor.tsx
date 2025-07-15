import type { RemoteUser } from "../types";

export const Cursor: React.FC<{ user: RemoteUser }> = ({ user }) => (
  <div
    style={{
      position: "fixed",
      top: user.y,
      left: user.x,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: user.color,
        margin: "0 auto 2px",
      }}
    />
    <span style={{ fontSize: 11, color: user.color }}>{user.name}</span>
  </div>
);