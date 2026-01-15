import { Link } from "react-router-dom";
import { useContext, useMemo } from "react";
import { recipecontext } from "../context/recipecontext";
import RecipeCard from "../Components/RecipeCard";
import { useAuth } from "../context/auth";

const Home = () => {
  const { data = [] } = useContext(recipecontext);
  const { isSeller } = useAuth() || {};
  const recent = useMemo(() => data.slice(-4).reverse(), [data]);
  return (
    <>
      {/* Hero */} 
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Cook, Save, and Share Your Favorite Recipes</h1>
            <p className="mt-4 text-white/90">Create your own recipes, edit them anytime, and mark favorites to find them fast.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/recipes" className="bg-white text-rose-600 font-semibold px-4 py-2 rounded hover:bg-gray-100">Browse Recipes</Link>
              {isSeller && (
                <Link to="/create" className="bg-rose-600 text-white font-semibold px-4 py-2 rounded hover:bg-rose-700">Create Recipe</Link>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            {/* <img className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105" src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop" alt="Delicious food" /> */}
             <img className="rounded-full h-100 ml-16 shadow-2xl transition-transform duration-300 hover:scale-105" src="https://i.pinimg.com/1200x/6b/65/41/6b6541cf791ecf8680de60f51e44e95f.jpg" alt="Delicious food" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Popular Categories</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Breakfast", value: "breakfast", icon: "ri-sun-foggy-line" },
            { label: "Lunch", value: "lunch", icon: "ri-restaurant-2-line" },
            { label: "Dinner", value: "dinner", icon: "ri-moon-clear-line" },
            { label: "Dessert", value: "dessert", icon: "ri-cake-2-line" },
          ].map((c) => (
            <Link
              key={c.value}
              to={`/recipes?cat=${c.value}`}
              className="inline-flex items-center gap-2 bg-white/80 text-rose-700 px-3 py-1.5 rounded-full hover:bg-white"
            >
              <i className={`${c.icon}`}></i> {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Recipes */} 
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Recipes</h2>
          <Link to="/recipes" className="text-sm underline">View all</Link>
        </div>
        {recent.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recent.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        ) : (
          <p className="text-white/90">No recipes yet — create your first one!</p>
        )}
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl mb-2"><i className="ri-add-circle-line"></i></div>
            <h3 className="font-semibold">Create</h3>
            <p className="text-sm text-white/90">Add title, photo, ingredients, and steps — it’s quick and simple.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl mb-2"><i className="ri-edit-2-line"></i></div>
            <h3 className="font-semibold">Edit</h3>
            <p className="text-sm text-white/90">Update anytime. Your changes are saved in your browser.</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-2xl mb-2"><i className="ri-heart-3-line"></i></div>
            <h3 className="font-semibold">Favorite</h3>
            <p className="text-sm text-white/90">Tap the heart to quickly find what you love.</p>
          </div>
        </div>
      </section>

      {/* Back to top */}
      <a href="#top" title="Back to top" className="fixed bottom-5 right-5 bg-white text-rose-600 p-2 rounded-full shadow hover:bg-gray-100">
        <i className="ri-arrow-up-line text-xl"></i>
      </a>

      {/* Footer */}
      <footer className="mt-10 border-t border-white/20 bg-white/10 backdrop">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4 text-white/90">
          <div>
            <h2 className="text-xl font-extrabold text-white">Recipe<span className="text-rose-300">Box</span></h2>
            <p className="mt-2 text-sm">A simple place to create, manage, and love your recipes.</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Explore</h3>
            <ul className="space-y-1 text-sm">
              <li><Link className="hover:underline" to="/recipes">All Recipes</Link></li>
              {isSeller && <li><Link className="hover:underline" to="/create">Create Recipe</Link></li>}
              {!isSeller && <li><Link className="hover:underline" to="/fav">Favorites</Link></li>}
              <li><Link className="hover:underline" to="/about">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Resources</h3>
            <ul className="space-y-1 text-sm">
              <li><a className="hover:underline" href="#">Getting Started</a></li>
              <li><a className="hover:underline" href="#">Tips & Tricks</a></li>
              <li><a className="hover:underline" href="#">Privacy</a></li>
              <li><a className="hover:underline" href="#">Terms</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2">Follow</h3>
            <div className="flex gap-3 text-xl">
              <a aria-label="Twitter" href="https://x.com/chandan101204" className="hover:text-white"><i className="ri-twitter-x-line"></i></a>
              <a aria-label="Instagram" href="https://instagram.com/mr.chandan.156" className="hover:text-white"><i className="ri-instagram-line"></i></a>
              <a aria-label="GitHub" href="https://github.com/chandan9648" className="hover:text-white"><i className="ri-github-line"></i></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-white/70">
            © {new Date().getFullYear()} RecipeBox. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
