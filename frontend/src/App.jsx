import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import VodPage from "./pages/VodPage";
import ClipsPage from "./pages/ClipsPage";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vod/:vodId" element={<VodPage />} />
        <Route path="/clips" element={<ClipsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;