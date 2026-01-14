import React from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { recipecontext } from "../context/recipecontext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import api from "../utils/axios.jsx";

const Create = () => {
  const navigate = useNavigate();
  const { isSeller } = useAuth() || {};
  const { data, setData } = useContext(recipecontext);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const SubmitHandler = async (recipe) => {
    try {
      // normalize fields
      const payload = {
        title: (recipe.title || '').trim(),
        image: (recipe.image || '').trim(),
        desc: (recipe.desc || '').trim(),
        chef: (recipe.chef || 'Anonymous').trim(),
        category: recipe.category || '',
        ingr: recipe.ingr || '',
        inst: recipe.inst || '',
      };

      const res = await api.post('recipes', payload);
      const created = res?.data?.recipe;
      if (!created) throw new Error('Recipe create failed');

      setData([created, ...data]);
      toast.success("Recipe Created Successfully");
      reset();
      navigate("/recipes");
    } catch (error) {
      console.error('Create recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to create recipe');
    }
  }

  const cover =
    watch("image")?.trim() ||
    "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1200&auto=format&fit=crop";
  const title = watch("title") || "Your Awesome Recipe";
  const chef = watch("chef") || "Anonymous";
  const desc = (watch("desc") || "Write a short, tasty description to entice readers...").slice(0, 100);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {!isSeller && (
        <div className="bg-yellow-200 text-black p-3 rounded mb-4">You don't have permission to create recipes.</div>
      )}
      <h1 className="text-2xl font-bold mb-6">Create a New Recipe</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit(SubmitHandler)} className="bg-white/10 rounded-lg p-5 space-y-4">
          {/* Image URL */}
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("image", {
                validate: (v) => !v || /^https?:\/\//i.test(v) || "Please enter a valid URL"
              })}
              type="url"
              placeholder="https://..."
            />
            {errors.image && <p className="text-yellow-200 text-xs mt-1">{errors.image.message}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("title", { required: "Title is required", minLength: { value: 3, message: "Minimum 3 characters" } })}
              type="text"
              placeholder="Recipe Title"
            />
            {errors.title && <p className="text-yellow-200 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Chef */}
          <div>
            <label className="block text-sm mb-1">Chef</label>
            <input
              className="w-full px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("chef")}
              type="text"
              placeholder="Chef Name (optional)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Short Description *</label>
            <textarea
              className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("desc", { required: "Please add a short description", minLength: { value: 10, message: "Minimum 10 characters" } })}
              placeholder="//Start from here"
            />
            {errors.desc && <p className="text-yellow-200 text-xs mt-1">{errors.desc.message}</p>}
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm mb-1">Ingredients</label>
            <textarea
              className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("ingr")}
              placeholder="Separate items with commas, e.g. Sugar, Flour, Eggs"
            />
            <p className="text-xs text-white/70 mt-1">Tip: You can edit later in the details page.</p>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm mb-1">Instructions</label>
            <textarea
              className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              {...register("inst")}
              placeholder="Separate steps with commas"
            />
          </div>

          {/* Category */}
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
              <option value="dessert">Dessert</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 disabled:opacity-70 text-white px-4 py-2 rounded cursor-pointer">
              Save Recipe
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="bg-white rounded-lg p-4 text-black">
          <div className="relative">
            <img className="w-full h-56 object-cover rounded-md" src={cover} alt={title} />
          </div>
          <h3 className="mt-3 text-xl font-bold">{title}</h3>
          <small className="text-rose-600 font-semibold">{chef}</small>
          <p className="text-sm text-gray-700 mt-1">{desc}{desc.length === 100 ? "…" : ""}</p>
        </div>
      </div>
    </div>
  );
};

export default Create;
