import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={styles.nav}>
      <h3 style={styles.logo}>Admin Panel</h3>

      <div style={styles.links}>
        <Link to="/admin/dashboard" style={styles.link}>
          Dashboard
        </Link>
        <Link to="/admin/users" style={styles.link}>
        Users
      </Link>
      <Link to="/admin/reviews" style={styles.link}>
        Reviews
      </Link>
        <Link to="/admin/withdrawals" style={styles.link}>
          Withdrawals
        </Link>
        <Link to="/admin/sitters" style={styles.link}>
          Sitters
        </Link>
        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#111",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
};
