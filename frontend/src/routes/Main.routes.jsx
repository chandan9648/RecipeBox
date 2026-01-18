import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Create from "../pages/Create";
import Recipe from "../pages/Recipes";
import About from "../pages/About";
import SingleRecipe from "../pages/SingleRecipe";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import { Navigate } from "react-router-dom";
import Fav from "../pages/Fav";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import { useAuth } from "../context/auth";

const SellerRoute = ({ children }) => {
  const location = useLocation();
  const { isSeller, isAdmin, user } = useAuth() || {};
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (!isSeller) return <Navigate to="/" replace />;
  return children;
}

const UserOnlyRoute = ({ children }) => {
  const location = useLocation();
  const { isSeller, isAdmin, user } = useAuth() || {};
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isSeller) return <Navigate to="/" replace />; // sellers not allowed
  return children;
}

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { isAdmin, user } = useAuth() || {};
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

const MainRoutes = () => {
  const { isAdmin, user, token, loading } = useAuth() || {};
  const isLoggedIn = !!(token || user);

  // If we have a token and are still hydrating the user, avoid rendering the wrong routes briefly.
  if (loading && isLoggedIn && !user) {
    return null;
  }

  // Admin experience: only show Admin Dashboard and redirect everything else to it.
  if (isLoggedIn && isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Primary list route */}
        <Route path="/recipes" element={<Recipe />} />
        {/* Backwards compatibility redirect */}
        <Route path="/recipe" element={<Navigate to="/recipes" replace />} />
        <Route path="/recipes/details/:id" element={<SingleRecipe />} />
        <Route path="/create" element={<SellerRoute><Create /></SellerRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/fav" element={<UserOnlyRoute><Fav /></UserOnlyRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
