import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";

import AccountContext from "../context/account-context";

const THEMES = ["light", "dark", "cupcake", "cyberpunk"];

export default function Header() {
  const accountContext = useContext(AccountContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState("cupcake");

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('data-theme')!;
    setTheme(savedTheme);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    console.log("Hi");
    localStorage.setItem('data-theme', theme)
  }, [theme]);

  const handleThemeChange = (e: any) => {
    const val = e.target.getAttribute("data-set-theme");
    setTheme(val);
  };

  return (
    <header className="bg-base-100 py-2 sticky top-0 z-50">
      <div className="container">
        <div className="navbar px-0">
          <div className="navbar-start">
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-circle btn-primary lg:hidden mr-1"
              >
                <i className="bi bi-list text-2xl"></i>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content mt-1 w-52 menu menu-compact p-2 bg-base-200 shadow rounded-box"
              >
                <li>
                  <Link to="/dashboard">Home</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/canvas">Canvas</Link>
                </li>
                <li>
                  <Link to="/marketplace">Marketplace</Link>
                </li>
              </ul>
            </div>
            <>
            <button
              className="top-4 left-4 z-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-700 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <Transition
              show={isOpen}
              enter="transition ease-out duration-100 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-100 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="fixed top-0 left-0 h-screen w-1/2 bg-white z-40 shadow-lg">
                <p className="text-gray-700 text-xl p-4">hello!</p>
              </div>
            </Transition>
          </>
          <div className="pl-0">
            <p className="btn btn-ghost normal-case text-3xl" >PaintNFT</p>
          </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal p-0 font-medium">
              <li>
                <Link to="/dashboard">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/canvas">Canvas</Link>
              </li>
              <li>
                <Link to="/marketplace">Marketplace</Link>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <div className="dropdown dropdown-end dropdown-hover">
              <label tabIndex={0} className="btn">
                {THEMES.length} Themes
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content mt-1 w-52 max-h-96 overflow-y-auto menu menu-compact p-2  bg-base-200 shadow rounded-box"
              >
                {THEMES.map((theme, i) => (
                  <li key={theme + i}>
                    <button
                      data-set-theme={theme}
                      onClick={handleThemeChange}
                      className="font-medium capitalize"
                    >
                      {i + 1 + ". " + theme}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => accountContext.disconnect()}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
