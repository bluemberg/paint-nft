import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CanvasPage from "./pages/CanvasPage";
import MarketplacePage from "./pages/MarketplacePage";

import { AccountContextProvider } from "./context/account-context";

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <AccountContextProvider>
          <Routes>
            <Route path="/" element={<LandingPage></LandingPage>} />
            <Route
              path="/dashboard"
              element={<DashboardPage></DashboardPage>}
            />
            <Route path="/canvas" element={<CanvasPage></CanvasPage>} />
            <Route
              path="/marketplace"
              element={<MarketplacePage></MarketplacePage>}
            />
          </Routes>
        </AccountContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
