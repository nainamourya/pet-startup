import { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../services/adminApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  const toggleBlock = async (user) => {
    if (user.isBlocked) {
      await unblockUser(user._id);
    } else {
      await blockUser(user._id);
    }
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Users</h2>

      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p><b>{user.name}</b> ({user.role})</p>
            <p>{user.email}</p>
            <p>Status: {user.isBlocked ? "Blocked" : "Active"}</p>
          </div>

          {user.role !== "admin" && (
            <button
              onClick={() => toggleBlock(user)}
              style={{
                background: user.isBlocked ? "green" : "red",
                color: "white",
                border: "none",
                padding: "6px 12px",
              }}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
