import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios.jsx";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const { isSeller, user, token, setToken, setUser } = useAuth() || {};
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);
  const isLoggedIn = !!(token || user);
  const displayName = user?.name || user?.email?.split?.('@')?.[0] || '';
  const handleLogout = async () => {
    try {
      await api.post('auth/logout', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // ignore network errors for UX, we'll still clear client state
    }
    setToken && setToken(null);
    setUser && setUser(null);
    closeMenu();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur bg-red-300/80 shadow-sm ">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between ">
        <NavLink to="/" className="font-extrabold text-lg text-black" onClick={closeMenu}>
          Recipe<span className="text-red-700">Box</span>
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 text-black font-semibold">
          <NavLink
            className={({ isActive }) =>
              `hover:text-red-700 ${isActive ? "text-red-700 underline underline-offset-4" : ""}`
            }
            to="/"
          >
            <i className="ri-home-line mr-1"></i> Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `hover:text-red-700 ${isActive ? "text-red-700 underline underline-offset-4" : ""}`
            }
            to="/recipes"
          >
            <i className="ri-restaurant-2-line mr-1"></i> Recipes
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `hover:text-red-700 ${isActive ? "text-red-700 underline underline-offset-4" : ""}`
            }
            to="/about"
          >
            <i className="ri-information-line mr-1"></i> About
          </NavLink>
          {isSeller && (
          <NavLink
            className={({ isActive }) =>
              `hover:text-red-700 ${isActive ? "text-red-700 underline underline-offset-4" : ""}`
            }
            to="/create"
          >
            <i className="ri-add-line mr-1"></i> Create
          </NavLink>
          )}
          {!isSeller && (
            <NavLink
              className={({ isActive }) =>
                `hover:text-red-700 ${isActive ? "text-red-700 underline underline-offset-4" : ""}`
              }
              to="/fav"
            >
              <i className="ri-heart-3-line mr-1"></i> Favorites
            </NavLink>
          )}
          {/* Display user name if logged in */}
          {isLoggedIn && displayName && (
            <span className="flex items-center gap-2 text-black/80 select-none">
              <i className="ri-user-3-line"></i>
              <span className="max-w-[140px] truncate bg-pink-100 px-1 rounded-md" title={displayName}>{displayName}</span>
            </span>
          )}

          {!isLoggedIn ? (
            <NavLink
              className={({ isActive }) =>
                `hover:text-red-700 ${isActive ? "text-red-700 underline underline-offset-4" : ""}`
              }
              to="/login"
            >
              <i className="ri-login-box-line mr-1"></i> Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-red-700 cursor-pointer"
            >
              <i className="ri-logout-box-line mr-1"></i> Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded hover:bg-red-200/60 text-black"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <i className={`ri-${open ? "close" : "menu"}-line text-2xl`}></i>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`${open ? "block" : "hidden"} md:hidden border-t border-red-200/60 bg-red-100/90 backdrop-blur-sm`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 text-black font-semibold">
          <NavLink
            className={({ isActive }) =>
              `py-1 ${isActive ? "text-red-700 underline underline-offset-4" : "hover:text-red-700"}`
            }
            to="/"
            onClick={closeMenu}
          >
            <i className="ri-home-line mr-1"></i> Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `py-1 ${isActive ? "text-red-700 underline underline-offset-4" : "hover:text-red-700"}`
            }
            to="/recipes"
            onClick={closeMenu}
          >
            <i className="ri-restaurant-2-line mr-1"></i> Recipes
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `py-1 ${isActive ? "text-red-700 underline underline-offset-4" : "hover:text-red-700"}`
            }
            to="/about"
            onClick={closeMenu}
          >
            <i className="ri-information-line mr-1"></i> About
          </NavLink>
          {isSeller && (
          <NavLink
            className={({ isActive }) =>
              `py-1 ${isActive ? "text-red-700 underline underline-offset-4" : "hover:text-red-700"}`
            }
            to="/create"
            onClick={closeMenu}
          >
            <i className="ri-add-line mr-1"></i> Create
          </NavLink>
          )}
          {!isSeller && (
            <NavLink
              className={({ isActive }) =>
                `py-1 ${isActive ? "text-red-700 underline underline-offset-4" : "hover:text-red-700"}`
              }
              to="/fav"
              onClick={closeMenu}
            >
              <i className="ri-heart-3-line mr-1"></i> Favorites
            </NavLink>
          )}

          {isLoggedIn && displayName && (
            <div className="py-1 flex items-center gap-2 text-black/80 select-none">
              <i className="ri-user-3-line"></i>
              <span className="truncate" title={displayName}>{displayName}</span>
            </div>
          )}

          {!isLoggedIn ? (
            <NavLink
              className={({ isActive }) =>
                `py-1 ${isActive ? "text-red-700 underline underline-offset-4" : "hover:text-red-700"}`
              }
              to="/login"
              onClick={closeMenu}
            >
              <i className="ri-login-box-line mr-1"></i> Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="text-left py-1 hover:text-red-700 cursor-pointer"
            >
              <i className="ri-logout-box-line mr-1 "></i> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
