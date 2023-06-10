import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Footer from "../components/Footer";
import Info from "./landing/Info";
import ScrollTop from "../components/ScrollTop";

import AccountContext from "../context/account-context";

const LandingPage = () => {
  const navigate = useNavigate();
  const accountContext = useContext(AccountContext);

  // redirect to dashboard if there is an active account
  useEffect(() => {
    (async () => {
      if (!accountContext.isConnected) {
        // recheck if there is a connected account
        const connected = await accountContext.fetchAccount();
        if (connected) {
          navigate("/dashboard");
        }
      } else if (accountContext.isConnected) {
        navigate("/dashboard");
      }
    })();
  }, []);

  return (
    <nav>
      <nav>
        <Header></Header>
        <Hero></Hero>
        <Info></Info>
        <Footer></Footer>
      </nav>
      <ScrollTop></ScrollTop>
    </nav>
  );
};

export default LandingPage;
