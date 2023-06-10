import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}
const BasePage = (props: Props) => {
  // old BasePage version (the one with the drawer. for reference only)

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <Navbar />
        <div className="relative mb-16 min-h-screen">{props.children}</div>
      </div>
      <div className="drawer-side z-20">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="font-bold btn-disabled">Navigation</div>
        <ul className="menu p-4 h-full w-80 bg-base-100 text-base-content">
          <div className="font-bold btn btn-ghost">Navigation</div>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/canvas">Canvas</Link>
          </li>
          <li>
            <Link to="/marketplace">Marketplace</Link>
          </li>
          <li>
            <Link to="/">Disconnect</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BasePage;
