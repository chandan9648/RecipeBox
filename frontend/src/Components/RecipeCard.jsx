import React from 'react'
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe, showStatus }) => {
  const { id: rId, _id, title, image, desc, chef, category, status } = recipe;
  const id = rId || _id;
  const safeTitle = title || "Untitled";
  const safeChef = chef || "Anonymous";
  const safeDesc = (desc || "").slice(0, 100);
  const cover = image || "https://via.placeholder.com/400x300?text=Recipe";

  return (
    <Link
      to={`/recipes/details/${id}`}
      className="shadow-md bg-white rounded-lg p-3 flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition duration-200"
    >
      <div className="relative">
        {category && (
          <span className="absolute top-2 left-2 z-10 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
            {category}
          </span>
        )}
        {showStatus && status && (
          <span className={`absolute top-2 right-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm capitalize ${status === 'approved' ? 'bg-green-500' : status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
            {status}
          </span>
        )}
        <img className="w-full h-40 object-cover rounded-md" src={cover} alt={safeTitle} />
      </div>
      <h3 className="mt-2 text-base text-black font-bold line-clamp-1">{safeTitle}</h3>
      <small className="text-rose-600 font-semibold">{safeChef}</small>
      <p className="text-sm text-gray-600 line-clamp-2">{safeDesc}… <span className="text-blue-500">More</span></p>
    </Link>
  );
}

export default RecipeCard;
