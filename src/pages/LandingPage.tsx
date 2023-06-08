import React from "react";

import Header from "./landing/Header";
import Hero from "./landing/Hero";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <nav>
      <Header></Header>
      <Hero></Hero>
      <Footer></Footer>
    </nav>
  );
};

export default LandingPage;
