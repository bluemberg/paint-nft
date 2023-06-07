import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CanvasPage from "./pages/CanvasPage";
import MarketplacePage from "./pages/MarketplacePage";

import { AccountContextProvider } from "./context/account-context";
import { MarketplaceContextProvider } from "./context/marketplace-context";
import { WalletContextProvider } from "./context/wallet-context";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <WalletContextProvider>
          <AccountContextProvider>
            <MarketplaceContextProvider>
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
            </MarketplaceContextProvider>
          </AccountContextProvider>
        </WalletContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
