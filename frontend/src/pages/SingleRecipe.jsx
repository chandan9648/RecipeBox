import React, { useContext, useEffect } from "react";
import {  useParams } from "react-router-dom";
import { recipecontext } from "../context/recipecontext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import api from "../utils/axios.jsx";

const SingleRecipe = () => {
  const { data, setData, favorites, setFavorites } = useContext(recipecontext);
  const navigate = useNavigate();
  const params = useParams();
  const { isSeller } = useAuth() || {};
  // Match id regardless of it being number (seed) or string (nanoid)
  const recipe = data.find((r) => String(r.id) === String(params.id));

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {},
  });

  // When recipe becomes available (after data load), populate form
  useEffect(() => {
    if (recipe) {
      reset({
        title: recipe.title || "",
        image: recipe.image || "",
        desc: recipe.desc || "",
        chef: recipe.chef || "",
        ingr: recipe.ingr || "",
        inst: recipe.inst || "",
        category: recipe.category || "",
      });
    }
  }, [recipe, reset]);

  const UpdateHandler = async (values) => {
    try {
      const res = await api.patch(`recipes/${params.id}`, values);
      const updated = res?.data?.recipe;
      if (!updated) throw new Error('Recipe update failed');

      const index = data.findIndex((r) => String(r.id) === String(params.id));
      const copydata = [...data];
      if (index >= 0) copydata[index] = updated;
      setData(copydata);

      toast.success("Recipe Updated!");
      reset(updated);
    } catch (error) {
      console.error('Update recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to update recipe');
    }
  };

  const DeleteHandler = async () => {
    if (!confirm("Delete this recipe?")) return;
    try {
      await api.delete(`recipes/${params.id}`);
      const filterdata = data.filter((r) => String(r.id) !== String(params.id));
      setData(filterdata);
      toast.info("Recipe Deleted!");
      navigate("/recipes");
    } catch (error) {
      console.error('Delete recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete recipe');
    }
  };

  const isFav = favorites.some((f) => String(f.id) === String(recipe.id));

  const FavHandler = () => {
    if (isFav) return;
    const updated = [...favorites, recipe];
    setFavorites(updated);
    // toast.success("Added to Favorites");
  };

  const UnfavHandler = () => {
    if (!isFav) return;
    const updated = favorites.filter((f) => String(f.id) !== String(recipe.id));
    setFavorites(updated);
    // toast.info("Removed from Favorites");
  };

  if (!recipe) {
    // Data loaded but recipe not found
    if (data.length > 0) return <div className="p-4">Recipe not found.</div>;
    // Still loading localStorage data
    return <div className="p-4">Loading...</div>;
  }

  const cover = recipe.image || "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 grid gap-6 md:grid-cols-2">
      {/* Left: Details */}
      <div className="relative bg-white/10 rounded-lg p-5">
        {!isSeller && (
          isFav ? (
            <i
              onClick={UnfavHandler}
              className="absolute top-4 right-4 cursor-pointer text-2xl text-red-600 ri-heart-fill"
              title="Remove from favorites"
            ></i>
          ) : (
              <i
                onClick={FavHandler}
                className="absolute top-4 right-4 cursor-pointer text-2xl text-gray-200 hover:text-red-500 ri-heart-line"
                title="Add to favorites"
              ></i>
          )
        )}

        <div className="relative">
          {recipe.category && (
            <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">
              {recipe.category}
            </span>
          )}
          <img className="w-[80%] h-60 object-cover mt-5 rounded-md" src={cover} alt={recipe.title || 'Recipe'} />
        </div>

        <h1 className="mt-3 text-3xl font-extrabold">{recipe.title || 'Untitled Recipe'}</h1>
        <small className="text-rose-200 font-semibold">{recipe.chef || 'Anonymous'}</small>
        <p className="text-sm my-3">{recipe.desc}</p>

        {/* details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="font-semibold mb-1 text-red-600">Ingredients</h4>
            <ul className="list-disc list-inside text-sm">
              {(recipe.ingr || "")
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
                .map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-1 text-red-600">Instructions</h4>
            <ol className="list-decimal list-inside text-sm space-y-1">
              {(recipe.inst || "")
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
                .map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Right: Edit Form (seller-only) */}
      {isSeller && (
      <form className="bg-white/10 rounded-lg p-5" onSubmit={handleSubmit(UpdateHandler)}>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("image")}
              type="url"
              placeholder="Enter Image URL"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("title")}
              type="text"
              placeholder="Recipe Title"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Chef</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("chef")}
              type="text"
              placeholder="Chef Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("desc")}
              placeholder="//Start from here"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Ingredients</label>
            <textarea
              className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("ingr")}
              placeholder="Write ingredients separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Instructions</label>
            <textarea
              className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("inst")}
              placeholder="Write instructions separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              className="w-full px-3 py-2 rounded bg-white/90 text-black focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("category")}
            >
              <option value="">Select Category</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer">
              Update Recipe
            </button>
            <button
              type="button"
              onClick={DeleteHandler}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Delete Recipe
            </button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};

export default SingleRecipe;
