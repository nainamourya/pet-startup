import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

export default function AdminSitters() {
  const [sitters, setSitters] = useState([]);

  const loadSitters = async () => {
    const res = await adminApi.get("/sitters");
    setSitters(res.data);
  };

  const toggle = async (sitter) => {
    if (sitter.isActive) {
      await adminApi.patch(`/sitters/${sitter._id}/disable`);
    } else {
      await adminApi.patch(`/sitters/${sitter._id}/enable`);
    }
    loadSitters();
  };

  useEffect(() => {
    loadSitters();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Sitters</h2>

      {sitters.map((s) => (
        <div
          key={s._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p><b>{s.name}</b></p>
            <p>{s.city}</p>
            <p>Status: {s.isActive ? "Active" : "Disabled"}</p>
          </div>

          <button
            onClick={() => toggle(s)}
            style={{
              background: s.isActive ? "red" : "green",
              color: "white",
              border: "none",
              padding: "6px 12px",
            }}
          >
            {s.isActive ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
