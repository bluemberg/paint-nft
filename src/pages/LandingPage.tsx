import React from "react";

import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Footer from "../components/Footer";
import Info from "./landing/Info";
import ScrollTop from "../components/ScrollTop";

const LandingPage = () => {
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
