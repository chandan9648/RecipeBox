import React from "react";
import Nav from "./Components/Nav";
import MainRoutes from "./routes/Main.routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div className="min-h-screen w-full bg-rose-400 text-white overflow-y-auto">
      <Nav />
      <MainRoutes />
      <ToastContainer />
    </div>
  );
};

export default App;
