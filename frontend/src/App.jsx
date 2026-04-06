import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Nav from "./components/Nav";
import HomePage from "./pages/HomePage";
import VodPage from "./pages/VodPage";
import ClipsPage from "./pages/ClipsPage";
import LivePage from "./pages/LivePage";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vod/:vodId" element={<VodPage />} />
        <Route path="/clips" element={<ClipsPage />} />
        <Route path="/live" element={<LivePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;