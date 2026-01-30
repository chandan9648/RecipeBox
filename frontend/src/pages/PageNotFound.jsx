import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-[calc(100vh-64px)] w-full px-4 py-10 flex items-center justify-center">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/0 via-white/40 to-white/0" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold tracking-wide text-white/90">
                <span className="h-2 w-2 rounded-full bg-white/70" />
                404 ERROR
              </p>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                Page not found
              </h1>
              <p className="max-w-prose text-sm leading-relaxed text-white/80 sm:text-base">
                The page you’re trying to open doesn’t exist or was moved.
              </p>
              <p className="text-xs text-white/60">
                Requested path: <span className="font-mono">{location.pathname}</span>
              </p>
            </div>

            <div className="shrink-0">
              <div className="select-none text-right text-[5.5rem] font-black leading-none text-white/25 sm:text-[6.5rem]">
                404
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-rose-500 shadow-lg shadow-black/15 transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Go to Home
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-black/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-black/25 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Go Back
            </button>

            <Link
              to="/recipes"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
