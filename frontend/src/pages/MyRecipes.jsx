import React, { useContext, useMemo } from "react";
import { recipecontext } from "../context/recipecontext";
import RecipeCard from "../Components/RecipeCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const MyRecipes = () => {
  const { data } = useContext(recipecontext);
  const { user } = useAuth() || {};

  const myRecipes = useMemo(() => {
    if (!user) return [];
    const userId = String(user._id || user.id);
    return data
      .filter((r) => String(r.createdBy) === userId)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [data, user]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 drop-shadow-sm">My Recipes</h1>
        <Link to="/create" className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-1">
          <i className="ri-add-line"></i> Add Recipe
        </Link>
      </div>

      {myRecipes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {myRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/20 rounded-xl shadow-inner border border-red-200">
          <p className="mb-4 text-gray-800 font-medium">You haven't shared any recipes yet.</p>
          <Link to="/create" className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg shadow-md font-semibold transition-transform hover:-translate-y-0.5">
            Share your first recipe
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
