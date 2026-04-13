import React, { useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { recipecontext } from "../context/recipecontext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import api from "../utils/axios.jsx";

const SingleRecipe = () => {
  const { data, setData, favorites, setFavorites } = useContext(recipecontext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { isSeller, user } = useAuth() || {};
  
  // Match id regardless of it being number (seed) or string (nanoid)
  const recipe = data.find((r) => String(r.id) === String(params.id));

  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState("");

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

  const isFav = recipe ? favorites.some((f) => String(f.id) === String(recipe.id)) : false;

  const FavHandler = () => {
    if (isFav) return;
    // Require login for favorites
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
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

  const LikeHandler = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      const res = await api.post(`recipes/${params.id}/like`);
      const updated = res?.data?.recipe;
      if (!updated) return;
      
      const index = data.findIndex((r) => String(r.id) === String(params.id));
      const copydata = [...data];
      if (index >= 0) copydata[index] = updated;
      setData(copydata);
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like recipe');
    }
  };

  const ReviewSubmitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      const res = await api.post(`recipes/${params.id}/review`, { rating: reviewRating, comment: reviewComment });
      const updated = res?.data?.recipe;
      if (!updated) return;
      
      const index = data.findIndex((r) => String(r.id) === String(params.id));
      const copydata = [...data];
      if (index >= 0) copydata[index] = updated;
      setData(copydata);
      
      toast.success("Review added!");
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

  if (!recipe) {
    // Data loaded but recipe not found
    if (data.length > 0) return <div className="p-4">Recipe not found.</div>;
    // Still loading localStorage data
    return <div className="p-4">Loading...</div>;
  }

  const cover = recipe.image || "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=1200&auto=format&fit=crop";

  const isLiked = user && recipe.likes?.includes(user._id || user.id);
  const totalLikes = recipe.likes?.length || 0;
  const avgRating = recipe.reviews?.length
    ? (recipe.reviews.reduce((acc, r) => acc + r.rating, 0) / recipe.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2">
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
        <div className="flex items-center gap-5 text-sm mt-2 mb-3">
          <small className="text-rose-200 font-semibold">{recipe.chef || 'Anonymous'}</small>
          <div className="flex items-center gap-1 text-yellow-500">
            <i className="ri-star-fill hover:scale-110 transition-transform"></i> <span className="text-gray-200">{avgRating} ({recipe.reviews?.length || 0})</span>
          </div>
          <div 
            onClick={LikeHandler}
            className={`flex items-center gap-1 cursor-pointer transition-colors ${isLiked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-400'}`}>
            <i className={`${isLiked ? "ri-thumb-up-fill" : "ri-thumb-up-line"} text-lg hover:scale-110 transition-transform`}></i> <span>{totalLikes}</span>
          </div>
        </div>
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

      {/* Reviews Section */}
      <div className="mt-8 bg-white/10 rounded-lg p-5">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>
        
        {/* Reviews List */}
        <div className="space-y-4 mb-6 md:w-2/3">
          {recipe.reviews && recipe.reviews.length > 0 ? (
            recipe.reviews.map((r, idx) => (
              <div key={idx} className="bg-black/20 p-4 rounded text-sm shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold shadow">
                      {r.user?.name ? r.user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="font-semibold text-rose-200 block">{r.user?.name || 'Unknown User'}</span>
                      <small className="text-gray-400">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="text-yellow-500 flex items-center gap-1 bg-black/40 px-2 py-1 rounded">
                    <i className="ri-star-fill"></i> {r.rating}
                  </div>
                </div>
                <p className="text-gray-200 mt-2 ml-11">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 bg-black/20 p-4 rounded">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Review Form */}
        <div className="bg-black/30 p-5 rounded-lg md:w-2/3 border border-gray-700">
          <h4 className="font-semibold mb-3 text-lg">Leave a Review</h4>
          <form onSubmit={ReviewSubmitHandler} className="grid gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Rating</label>
              <div className="flex gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i 
                    key={star}
                    className={`text-2xl cursor-pointer transition-colors ${reviewRating >= star ? "ri-star-fill text-yellow-500" : "ri-star-line text-gray-400 hover:text-yellow-400"}`}
                    onClick={() => setReviewRating(star)}
                  ></i>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Comment</label>
              <textarea 
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full min-h-24 px-3 py-2 rounded bg-white/90 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-y" 
                placeholder="What did you think of this recipe?"
                required
              />
            </div>
            <div>
              <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded font-medium shadow-md cursor-pointer transition-colors w-full md:w-auto">
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default SingleRecipe;
