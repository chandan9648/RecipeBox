import React, { useCallback, useEffect, useState } from "react";
import api from "../utils/axios.jsx";
import { useAuth } from "../context/auth";

const AdminDashboard = () => {
  const { user } = useAuth() || {};
  const [stats, setStats] = useState({ usersCount: 0, recipesCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("admin/stats");
      const usersCount = Number(res?.data?.usersCount || 0);
      const recipesCount = Number(res?.data?.recipesCount || 0);
      setStats({ usersCount, recipesCount });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-green-100 rounded-lg p-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-black">
          Welcome back, {user?.name || "Admin"}!
        </h1>
        <button
          onClick={loadStats}
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white px-4 py-2 rounded"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white/90 rounded-xl shadow p-6 text-black">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="mt-2 text-4xl font-extrabold">{stats.usersCount}</div>
          <div className="mt-2 text-xs text-gray-500">Registered accounts (excluding admins)</div>
        </div>

        <div className="bg-white/90 rounded-xl shadow p-6 text-black">
          <div className="text-sm text-gray-600">Total Recipes Shared</div>
          <div className="mt-2 text-4xl font-extrabold">{stats.recipesCount}</div>
          <div className="mt-2 text-xs text-gray-500">Count only (no recipe details)</div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 text-red-700 border border-red-200 rounded p-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
