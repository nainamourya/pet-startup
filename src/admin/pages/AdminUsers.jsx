import { useEffect, useState } from "react";
import { getUsers, blockUser, unblockUser } from "../services/adminApi";

// Professional SVG Icons
const Icons = {
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Email: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Lock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Unlock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Briefcase: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Toggle Switch Component
const ToggleSwitch = ({ isBlocked, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 ${
      isBlocked 
        ? 'bg-red-500 focus:ring-red-100' 
        : 'bg-green-500 focus:ring-green-100'
    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
        isBlocked ? 'translate-x-1' : 'translate-x-7'
      }`}
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isBlocked ? (
            <Icons.Lock className="w-3 h-3 text-red-600" />
          ) : (
            <Icons.Check className="w-3 h-3 text-green-600" />
          )}
        </div>
      )}
    </span>
  </button>
);

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (user) => {
    setTogglingId(user._id);
    try {
      if (user.isBlocked) {
        await unblockUser(user._id);
      } else {
        await blockUser(user._id);
      }
      loadUsers();
    } catch (error) {
      console.error("Failed to toggle user:", error);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search, role, and status
  const filteredUsers = users.filter((user) => {
    if (!user) return false;
  
    const name = typeof user.name === "string" ? user.name.toLowerCase() : "";
    const email = typeof user.email === "string" ? user.email.toLowerCase() : "";
    const search = typeof searchTerm === "string" ? searchTerm.toLowerCase() : "";
  
    const matchesSearch =
      name.includes(search) || email.includes(search);
  
    const matchesRole =
      filterRole === "all" || user.role === filterRole;
  
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBlocked) ||
      (filterStatus === "blocked" && user.isBlocked);
  
    return matchesSearch && matchesRole && matchesStatus;
  });
  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isBlocked).length;
  const blockedUsers = users.filter(u => u.isBlocked).length;
  const adminUsers = users.filter(u => u.role === "admin").length;
  const ownerUsers = users.filter(u => u.role === "owner").length;
  const sitterUsers = users.filter(u => u.role === "sitter").length;

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" };
      case "owner":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "sitter":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Icons.Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Users</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                View and control user accounts
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icons.Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Icons.Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Icons.Lock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Blocked</p>
                  <p className="text-2xl font-bold text-red-600">{blockedUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Icons.Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Admins</p>
                  <p className="text-2xl font-bold text-purple-600">{adminUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icons.User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Owners</p>
                  <p className="text-2xl font-bold text-blue-600">{ownerUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Icons.Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Sitters</p>
                  <p className="text-2xl font-bold text-green-600">{sitterUsers}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icons.Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Role Filter */}
              <div className="flex gap-2">
                {["all", "admin", "owner", "sitter"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize ${
                      filterRole === role
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {["all", "active", "blocked"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all capitalize ${
                      filterStatus === status
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredUsers.length}</span> of{" "}
                <span className="font-bold text-gray-900">{users.length}</span> users
              </p>
            </div>
          </div>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Icons.Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterRole !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users have been registered yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => {
              const roleColor = getRoleColor(user.role);
              return (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                      {(user.name || "U").charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {user.name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${roleColor.bg} ${roleColor.text} border ${roleColor.border}`}>
                            {user.role === "admin" && <Icons.Shield className="w-3 h-3" />}
                            {user.role === "owner" && <Icons.User className="w-3 h-3" />}
                            {user.role === "sitter" && <Icons.Briefcase className="w-3 h-3" />}
                            {user.role.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Icons.Email className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>

                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                              user.isBlocked
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Control */}
                    {user.role !== "admin" && (
                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500 mb-1">Account Status</p>
                          <ToggleSwitch
                            isBlocked={user.isBlocked}
                            onClick={() => toggleBlock(user)}
                            loading={togglingId === user._id}
                          />
                        </div>
                        <div className="hidden sm:block text-xs text-gray-500 text-right">
                          {user.isBlocked ? "Click to unblock" : "Click to block"}
                        </div>
                      </div>
                    )}

                    {/* Admin Badge (non-actionable) */}
                    {user.role === "admin" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
                        <Icons.Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-bold text-purple-600">Protected Admin</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}