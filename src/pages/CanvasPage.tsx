import React from "react";

import BasePage from "./BasePage";
import Canvas from "../components/Canvas";

const CanvasPage = () => {
  return (
    <BasePage>
    
      {/* <h1 className="text-left text-6xl font-bold pl-24 pt-12">Canvas</h1>

      <div className="px-24">
        <div className="divider"></div>
      </div> */}

      <Canvas></Canvas>
    </BasePage>
  );
};

export default CanvasPage;
