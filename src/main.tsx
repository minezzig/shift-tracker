import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Layout from "./Layout.tsx";
import Profile from "./Profile.tsx";
import History from "./History.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import HistoryDetail from "./HistoryDetail.tsx";
import AllHistory from "./AllHistory.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />
          <Route path="history/all" element={<AllHistory />} />
          <Route path="history/:id" element={<HistoryDetail />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
