import React from "react";

import BasePage from "./BasePage";
import Canvas from "../components/Canvas";

const CanvasPage = () => {
  return (
    <BasePage>
      <h1 className="text-center text-4xl">Canvas Page</h1>
      <Canvas></Canvas>
    </BasePage>
  );
};

export default CanvasPage;
