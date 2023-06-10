import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

import AccountContext from "../context/account-context";

interface Props {
  children: React.ReactNode;
}
const BasePage = (props: Props) => {
  const navigate = useNavigate();
  const accountContext = useContext(AccountContext);

  // NOTE: BasePage === Protected page (need authentication to access)
  useEffect(() => {
    (async () => {
      if (!accountContext.isConnected) {
        // recheck if there is a connected account
        const connected = await accountContext.fetchAccount();
        if (!connected) {
          navigate("/");
        }
      }
    })();
  }, []);

  return (
    <nav>
      <nav>
        <Navbar></Navbar>
        <div className="relative mb-16 min-h-screen">{props.children}</div>
        <Footer></Footer>
      </nav>
      <ScrollTop></ScrollTop>
    </nav>
  );
};

export default BasePage;
