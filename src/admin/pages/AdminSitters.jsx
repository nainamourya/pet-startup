import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

// Professional SVG Icons
const Icons = {
  Briefcase: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Location: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  AlertCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Toggle Switch Component
const ToggleSwitch = ({ isActive, onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 ${
      isActive 
        ? 'bg-green-500 focus:ring-green-100' 
        : 'bg-red-500 focus:ring-red-100'
    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
  >
    <span
      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
        isActive ? 'translate-x-7' : 'translate-x-1'
      }`}
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {isActive ? (
            <Icons.Check className="w-3 h-3 text-green-600" />
          ) : (
            <Icons.X className="w-3 h-3 text-red-600" />
          )}
        </div>
      )}
    </span>
  </button>
);

export default function AdminSitters() {
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, disabled
  const [togglingId, setTogglingId] = useState(null);

  const loadSitters = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get("/sitters");
      setSitters(res.data);
    } catch (error) {
      console.error("Failed to load sitters:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (sitter) => {
    setTogglingId(sitter._id);
    try {
      if (sitter.isActive) {
        await adminApi.patch(`/sitters/${sitter._id}/disable`);
      } else {
        await adminApi.patch(`/sitters/${sitter._id}/enable`);
      }
      loadSitters();
    } catch (error) {
      console.error("Failed to toggle sitter:", error);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    loadSitters();
  }, []);

  // Filter sitters based on search and status
  const filteredSitters = sitters.filter((s) => {
    const matchesSearch = (s.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                         (s.city?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "active" && s.isActive) ||
                         (filterStatus === "disabled" && !s.isActive);
    return matchesSearch && matchesStatus;
  });

  const activeCount = sitters.filter(s => s.isActive).length;
  const disabledCount = sitters.filter(s => !s.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading sitters...</p>
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
              <Icons.Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sitters</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                View and control sitter accounts
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Icons.Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Total Sitters</p>
                  <p className="text-2xl font-bold text-gray-900">{sitters.length}</p>
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
                  <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <Icons.AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Disabled</p>
                  <p className="text-2xl font-bold text-red-600">{disabledCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icons.Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    filterStatus === "all"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icons.Filter className="w-4 h-4" />
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    filterStatus === "active"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icons.Check className="w-4 h-4" />
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("disabled")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    filterStatus === "disabled"
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icons.X className="w-4 h-4" />
                  Disabled
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredSitters.length}</span> of{" "}
                <span className="font-bold text-gray-900">{sitters.length}</span> sitters
              </p>
            </div>
          </div>
        </div>

        {/* Sitters List */}
        {filteredSitters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Icons.Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Sitters Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No sitters have been registered yet"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSitters.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Sitter Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                      {(s.name || "S").charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {s.name || "Unknown Sitter"}
                        </h3>
                        {s.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            <Icons.Shield className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Icons.Location className="w-4 h-4" />
                        <span>{s.city || "Location not specified"}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="inline-flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                            s.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                          {s.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Control */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-500 mb-1">Account Status</p>
                      <ToggleSwitch
                        isActive={s.isActive}
                        onClick={() => toggle(s)}
                        loading={togglingId === s._id}
                      />
                    </div>
                    <div className="hidden sm:block text-xs text-gray-500 text-right">
                      {s.isActive ? "Click to disable" : "Click to enable"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}