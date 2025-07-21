import React from "react";
import Home from "../src/pages/Home/Home";
import { useContext } from "react";
import { AppContext, AppProvider } from "./Context/AppContext";
const App = () => {
  const { darkMode, setDarkMode } = useContext(AppContext);
  return (
    <div
      className={darkMode ? "!bg-[#1F242D] !text-white" : "bg-white text-black"}
    >
      <Home />
    </div>
  );
};

export default App;
