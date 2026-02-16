import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../utils/axios.jsx";
import { useAuth } from "../context/auth";
import { toast } from "react-toastify";
import { Mail, Trash2, User, UtensilsCrossed } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth() || {};
  const [stats, setStats] = useState({ usersCount: 0, recipesCount: 0 });
  const [userRecipeStats, setUserRecipeStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, userStatsRes] = await Promise.all([
        api.get("admin/stats"),
        api.get("admin/user-recipe-stats"),
      ]);

      const usersCount = Number(statsRes?.data?.usersCount || 0);
      const recipesCount = Number(statsRes?.data?.recipesCount || 0);
      setStats({ usersCount, recipesCount });

      const users = Array.isArray(userStatsRes?.data?.users)
        ? userStatsRes.data.users
        : [];
      setUserRecipeStats(users);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const pieData = useMemo(() => {
    const list = Array.isArray(userRecipeStats) ? userRecipeStats : [];
    const normalized = list
      .map((u) => ({
        name: u?.name || "Unknown",
        email: u?.email || "",
        value: Number(u?.recipeCount || 0),
      }))
      .filter((d) => d.value > 0);

    // Keep chart readable: show top 8 + Others
    const top = normalized.slice(0, 8);
    const rest = normalized.slice(8);
    const othersValue = rest.reduce((sum, d) => sum + d.value, 0);
    return othersValue > 0
      ? [...top, { name: "Others", email: "", value: othersValue }]
      : top;
  }, [userRecipeStats]);

  const COLORS = [
    "#ff4d6d",
    "#4dabf7",
    "#20c997",
    "#845ef7",
    "#ffd43b",
    "#ff922b",
    "#51cf66",
    "#748ffc",
    "#94d82d",
  ];

  const handleDeleteUser = useCallback(
    async (u) => {
      const userId = u?.userId;
      if (!userId) return;

      const name = u?.name || u?.email || "this user";
      const ok = window.confirm(
        `Delete ${name}?\n\nThis will also delete all recipes created by this user.`
      );
      if (!ok) return;

      setDeletingUserId(userId);
      setError("");
      try {
        await api.delete(`admin/users/${userId}`);
        await loadDashboard();
        toast.success(`${name} deleted successfully`);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to delete user");
        toast.error(e?.response?.data?.message || "Failed to delete user");
      } finally {
        setDeletingUserId(null);
      }
    },
    [loadDashboard]
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-red-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
          Welcome back, {user?.name || "Admin"}! 
        </h1>
        <button
          onClick={loadDashboard}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-5 py-2 rounded-lg font-medium cursor-pointer w-full sm:w-auto"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 text-red-700 border border-red-200 rounded p-3">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Left: User list */}
        <div className="bg-green-50 rounded-2xl p-4 md:p-6 shadow-sm border border-green-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-sm font-extrabold tracking-wider text-gray-800">
              USER INFO
            </h2>
            <div className="text-xs text-gray-600 flex flex-wrap gap-x-2">
              <span>
                Total users: <span className="font-semibold">{stats.usersCount}</span>
              </span>
              <span>
                • Total recipes: <span className="font-semibold">{stats.recipesCount}</span>
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {(userRecipeStats?.length ? userRecipeStats : []).map((u) => (
              <div
                key={u?.userId || u?.email}
                className="bg-white rounded-xl border border-green-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="mt-1 h-9 w-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-gray-900 truncate" title={u?.name || ""}>
                      {u?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 min-w-0">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span
                        className="truncate flex-1"
                        title={u?.email || ""}
                      >
                        {u?.email || "-"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 shrink-0" />
                      <span>
                        Total recipes: <span className="font-semibold">{Number(u?.recipeCount || 0)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full justify-end sm:w-auto">
                  <div className="text-sm font-semibold text-gray-700">
                    {Number(u?.recipeCount || 0)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(u)} 
                    disabled={loading || deletingUserId === u?.userId}
                    title="Delete user"
                    className="h-9 w-9  rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center disabled:opacity-60 cursor-pointer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {!loading && (!userRecipeStats || userRecipeStats.length === 0) && (
              <div className="bg-white rounded-xl border border-green-100 p-4 text-sm text-gray-600">
                No users found.
              </div>
            )}
          </div>
        </div>

        {/* Right: Pie chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-extrabold text-center text-gray-900">
            User Uploads Pie Chart
          </h2>

          <div className="mt-4 h-[380px] w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No recipe data to display.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value, _name, props) => {
                      const email = props?.payload?.email;
                      return [
                        `${value} recipes${email ? ` • ${email}` : ""}`,
                        "",
                      ];
                    }}
                  />
                  <Legend verticalAlign="top" height={80} />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="55%"
                    outerRadius={125}
                    stroke="#fff"
                    strokeWidth={2}
                    label
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
