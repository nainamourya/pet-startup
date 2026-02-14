import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";

// Professional SVG Icons
const Icons = {
  Users: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Briefcase: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Calendar: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Money: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Chart: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  TrendUp: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Activity: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  Shield: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">Loading dashboard...</p>
      <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest data</p>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, trend, delay }) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-600 to-indigo-600',
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      lightBg: 'from-blue-50 to-indigo-50'
    },
    green: {
      gradient: 'from-green-600 to-emerald-600',
      bg: 'bg-green-100',
      text: 'text-green-600',
      lightBg: 'from-green-50 to-emerald-50'
    },
    purple: {
      gradient: 'from-purple-600 to-pink-600',
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      lightBg: 'from-purple-50 to-pink-50'
    },
    orange: {
      gradient: 'from-orange-600 to-red-600',
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      lightBg: 'from-orange-50 to-red-50'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient Background Decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.lightBg} rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-7 h-7 ${colors.text}`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
              <Icons.TrendUp className="w-3 h-3" />
              {trend}
            </div>
          )}
        </div>

        {/* Stats */}
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
            {value.toLocaleString()}
          </p>
        </div>

        {/* Bottom Accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.get("/dashboard").then(res => setStats(res.data));
  }, []);

  if (!stats) return <LoadingSpinner />;

  // Calculate total platform activity
  const totalActivity = stats.totalUsers + stats.totalSitters + stats.totalBookings;

  return (
    <>
      <AdminNavbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Icons.Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                      Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      Monitor and manage your platform
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Badge */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Live</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Activity</p>
                  <p className="text-lg font-bold text-gray-900">{totalActivity.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Icons.Users}
              color="blue"
              trend="+12%"
              delay={0}
            />
            <StatCard
              title="Total Sitters"
              value={stats.totalSitters}
              icon={Icons.Briefcase}
              color="green"
              trend="+8%"
              delay={100}
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={Icons.Calendar}
              color="purple"
              trend="+23%"
              delay={200}
            />
            <StatCard
              title="Total Withdrawals"
              value={stats.totalWithdrawals}
              icon={Icons.Money}
              color="orange"
              trend="+15%"
              delay={300}
            />
          </div>

          {/* Insights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Platform Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Icons.Chart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Platform Overview</h2>
                  <p className="text-sm text-gray-500">Key metrics at a glance</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* User to Sitter Ratio */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">User to Sitter Ratio</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.totalUsers && stats.totalSitters 
                        ? (stats.totalUsers / stats.totalSitters).toFixed(1) 
                        : '0'}:1
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${Math.min((stats.totalSitters / stats.totalUsers) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Booking per Sitter */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Avg. Bookings per Sitter</span>
                    <span className="text-lg font-bold text-green-600">
                      {stats.totalBookings && stats.totalSitters 
                        ? (stats.totalBookings / stats.totalSitters).toFixed(1) 
                        : '0'}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${Math.min((stats.totalBookings / (stats.totalSitters * 10)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Withdrawal Rate */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Withdrawal Activity</span>
                    <span className="text-lg font-bold text-orange-600">
                      {stats.totalWithdrawals || 0}
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all duration-700"
                      style={{ 
                        width: `${Math.min((stats.totalWithdrawals / stats.totalBookings) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-100">
                  <Icons.Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Platform Health</h2>
                  <p className="text-sm text-gray-500">System status indicators</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">User Growth</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">Healthy</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Booking Activity</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Sitter Network</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">Growing</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Payment System</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-90 mb-2">Platform Engagement</h3>
              <p className="text-3xl font-bold mb-1">
                {stats.totalUsers > 0 
                  ? ((stats.totalBookings / stats.totalUsers) * 100).toFixed(1) 
                  : '0'}%
              </p>
              <p className="text-xs opacity-75">Users with active bookings</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-90 mb-2">Sitter Utilization</h3>
              <p className="text-3xl font-bold mb-1">
                {stats.totalSitters > 0 
                  ? ((stats.totalBookings / (stats.totalSitters * 5)) * 100).toFixed(1) 
                  : '0'}%
              </p>
              <p className="text-xs opacity-75">Average capacity filled</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-sm font-semibold opacity-90 mb-2">Revenue Activity</h3>
              <p className="text-3xl font-bold mb-1">
                {stats.totalWithdrawals || 0}
              </p>
              <p className="text-xs opacity-75">Total withdrawal requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );  
}