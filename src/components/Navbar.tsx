import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CopyToClipboard from "copy-to-clipboard";

import AccountContext from "../context/account-context";

const THEMES = ["light", "dark", "cupcake", "pastel", "cyberpunk"];

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
    localStorage.setItem('data-theme', theme)
  }, [theme]);

  const handleThemeChange = (e: any) => {
    const val = e.target.getAttribute("data-set-theme");
    setTheme(val);
  };

  return (
    <header className="bg-base-100 py-2 sticky top-0 z-10">
      <div className="container">
        <div className="navbar px-0">
          <div className="navbar-start">
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-circle btn-primary lg:hidden mr-1"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content mt-1 w-52 menu menu-compact p-2 bg-base-200 shadow rounded-box"
              >
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

            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                
                <label htmlFor="my-drawer" className="btn btn-primary drawer-button"> 
                  <i className="bi bi-list text-3xl"></i>
                </label>
              </div> 
              <div className="drawer-side z-20">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">

                    <h1 className="px-3 pt-3 normal-case text-3xl font-semibold">Account</h1>
                    <div className="flex flex-col w-full">
                        <div className="divider"></div> 
                    </div>
                    <div className="card w-full bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Address</h2>
                        <p className="break-words">{accountContext.address}</p>
                        <div className="card-actions justify-end">
                          <button className="btn btn-primary onClick={copyToClipboard}">
                            Copy to clipboard
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="divider"></div> 
                    </div>
                    <div className="card w-69 bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Balance</h2>
                        <p>{accountContext.balance} mutez</p>
                      </div>
                    </div>
                  <button
                  className="btn btn-error absolute inset-x-4 bottom-6"
                  onClick={() => accountContext.disconnect()}
                  >
                    Disconnect
                  </button>
                </ul>
              </div>
            </div>

          </>
          <Link to="/dashboard" className=" static pr-24">
            <p className="btn btn-ghost normal-case text-3xl" >PaintNFT</p>
          </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal p-2 font-medium text-base">
              <li className="hover:font-semibold px-0">
                <a>
                  <i className="bi bi-ui-checks-grid text-xl"></i>
                  <Link to="/dashboard">Dashboard</Link>
                </a>
              </li>
              <div className="divider lg:divider-horizontal"></div> 
              <li className="hover:font-semibold px-0">
                <a>
                <i className="bi bi-palette text-xl"></i>
                  <Link to="/canvas">Canvas</Link>
                </a>
              </li>
              <div className="divider lg:divider-horizontal"></div> 
              <li className="hover:font-semibold px-0">
                <a>
                  <i className="bi bi-easel2 text-xl"></i>
                  <Link to="/marketplace">Marketplace</Link>
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn text-base">
                {THEMES.length} Themes
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content w-52 max-h-96 overflow-y-auto menu menu-compact p-2  bg-base-200 shadow rounded-box"
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
          </div>
        </div>
      </div>
    </header>
  );
}
