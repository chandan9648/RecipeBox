import React, { useEffect, useMemo, useState } from "react";
import { recipecontext as RECIPECONTEXT } from "./recipecontext";
import { useAuth } from "./auth";
import api from "../utils/axios.jsx";

const RecipeContext = (props) => {
  const { user } = useAuth() || {};
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const favoritesKey = useMemo(() => {
    const userId = user?._id || user?.id;
    const identity = userId || user?.email;
    return identity ? `favorite:${identity}` : "favorite:guest";
  }, [user]);

  const safeParse = (raw, fallback) => {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  // One-time migration: old shared key -> guest key
  useEffect(() => {
    const legacy = localStorage.getItem("favorite");
    if (!legacy) return;
    const alreadyMigrated = localStorage.getItem("favorite:guest");
    if (alreadyMigrated) {
      localStorage.removeItem("favorite");
      return;
    }
    localStorage.setItem("favorite:guest", legacy);
    localStorage.removeItem("favorite");
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadRecipes() {
      try {
        const res = await api.get('recipes');
        const list = res?.data?.recipes || [];
        if (mounted) setData(list);
      } catch (e) {
        // Fallback (older behavior) in case backend is down
        const local = safeParse(localStorage.getItem('recipe'), []);
        if (mounted) setData(local);
      }
    }
    loadRecipes();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load favorites for current user/guest
  useEffect(() => {
    setFavorites(safeParse(localStorage.getItem(favoritesKey), []));
  }, [favoritesKey]);

  // Persist favorites when they change
  useEffect(() => {
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }, [favorites, favoritesKey]);



  //   {
  //     "id": 1,
  //     "title": "Classic Margherita Pizza",
  //     "ingredients": [
  //       "Pizza dough",
  //       "Tomato sauce",
  //       "Fresh mozzarella cheese",
  //       "Fresh basil leaves",
  //       "Olive oil",
  //       "Salt and pepper to taste"
  //     ],
  //     "instructions": [
  //       "Preheat the oven to 475°F (245°C).",
  //       "Roll out the pizza dough and spread tomato sauce evenly.",
  //       "Top with slices of fresh mozzarella and fresh basil leaves.",
  //       "Drizzle with olive oil and season with salt and pepper.",
  //       "Bake in the preheated oven for 12-15 minutes or until the crust is golden brown.",
  //       "Slice and serve hot."
  //     ],
   
  //     image: "https://cdn.dummyjson.com/recipe-images/1.webp",
  //    chef: "chandan",
  //     category: "dinner",
  //     desc: "Roll out the pizza dough and spread tomato sauce evenly. Top with slices of fresh mozzarella and fresh basil leaves.",
      
  //   },
  // 



  return (
    <RECIPECONTEXT.Provider value={{ data, setData, favorites, setFavorites }}>
      {props.children}
    </RECIPECONTEXT.Provider>
  );
};

export default RecipeContext;
