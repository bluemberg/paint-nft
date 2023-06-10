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
          alert(
            "Please connect your wallet. (Note: This is just temporary UI. Need to change this to a proper modal or something.)"
          );
          navigate("/");
        }
      }
    })();
  }, []);

  return (
    <nav>
      <nav>
        <Navbar></Navbar>
        <div className="container text-center border">
          <p>Account: {accountContext.address}</p>
          <p>Balance: {accountContext.balance} mutez</p>
          <p>
            Note: this is just a temporary UI. Redesign this and the disconnect
            button above (maybe use a sidebar/drawer?).
          </p>
        </div>
        <div className="relative mb-16 min-h-screen">{props.children}</div>
        <Footer></Footer>
      </nav>
      <ScrollTop></ScrollTop>
    </nav>
  );
};

export default BasePage;
