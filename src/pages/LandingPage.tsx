import React from "react";

import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Footer from "../components/Footer";
import Info from "./landing/Info";

const LandingPage = () => {
  return (
    <nav>
      <Header></Header>
      <Hero></Hero>
      <Info></Info>
      <Footer></Footer>
    </nav>
  );
};

export default LandingPage;
