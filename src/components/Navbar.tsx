import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 sticky top-0 z-10 border border-b-2 border-x-0 mb-8">
      <div className="navbar-start">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <i className="fas fa-bars"></i>
        </label>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">Paint NFT</a>
      </div>
      <div className="navbar-end"></div>
    </nav>
  );
};

export default Navbar;
