import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Props {
  children: React.ReactNode;
}
const BasePage = (props: Props) => {
  return (
    <nav>
      <Navbar></Navbar>
      <div className="relative mb-16 min-h-screen">{props.children}</div>
      <Footer></Footer>
    </nav>
  );
};

export default BasePage;