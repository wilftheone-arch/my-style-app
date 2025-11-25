// src/App.jsx
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home.jsx";
import Wardrobe from "./Pages/Wardrobe.jsx";
import Outfits from "./Pages/Outfits.jsx";
import Shopping from "./Pages/Shopping.jsx";
import Profile from "./Pages/Profile.jsx";
import StyleSwiper from "./Pages/StyleSwiper.jsx";
import Scan from "./Pages/Scan.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/outfits" element={<Outfits />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/styleswiper" element={<StyleSwiper />} />
        <Route path="/scan" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  );
}
