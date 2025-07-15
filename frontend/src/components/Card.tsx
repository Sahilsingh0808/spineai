import React from "react";
import type { RemoteUser } from "../types";

interface Props {
  cardRef: React.RefObject<HTMLDivElement>;
  usersInCard: RemoteUser[];
  hoveredUsers: string[];
}

export const Card: React.FC<Props> = ({
  cardRef,
  usersInCard,
  hoveredUsers,
}) => (
  <div
    ref={cardRef}
    style={{
      width: 480,
      maxWidth: "90%",
      height: 260,
      margin: "100px auto",
      background: "rgba(255, 255, 255, 0.75)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,.4)",
      borderRadius: 16,
      boxShadow: "0 8px 24px rgba(0,0,0,.12)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: 24,
      transition: "transform .2s ease",
      fontFamily: "Inter, sans-serif",
    }}
  >
    <span style={{ fontSize: 24, fontWeight: 700, color: "#222" }}>
      Shared&nbsp;Card
    </span>

    {/* Hover banner */}
    {hoveredUsers.length > 0 && (
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "#4f46e5",
          color: "#fff",
          padding: "6px 10px",
          borderRadius: 6,
          fontSize: 13,
          boxShadow: "0 2px 6px rgba(0,0,0,.15)",
        }}
      >
        Hovered by&nbsp;
        {hoveredUsers.map((n, i) => (
          <React.Fragment key={n}>
            {i > 0 && ", "}
            {n}
          </React.Fragment>
        ))}
      </div>
    )}

    {/* Users currently inside card */}
    {usersInCard.length > 0 && (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        {usersInCard.map((u) => (
          <span
            key={u.clientId}
            style={{
              background: u.color,
              color: "#fff",
              fontSize: 12,
              padding: "2px 6px",
              borderRadius: 4,
              boxShadow: "0 1px 3px rgba(0,0,0,.2)",
            }}
          >
            {u.name} in card
          </span>
        ))}
      </div>
    )}
  </div>
);
