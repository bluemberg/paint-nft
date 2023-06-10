import React, { useEffect, useContext } from "react";

import AccountContext from "../../context/account-context";

export default function Hero() {
  const accountContext = useContext(AccountContext);

  return (
    <section>
      <div className="container">
        <div
          className="hero h-96 md:h-[500px] rounded-box overflow-hidden"
          style={{
            backgroundImage: `url("https://img.freepik.com/free-vector/vintage-vaporwave-background_23-2148886069.jpg?w=996&t=st=1686232901~exp=1686233501~hmac=41e59c90884fe56d3e66d601608a4af0d86465ace371208637a634df15c556d5")`,
          }}
        >
          <div className="hero-overlay bg-opacity-60 bg-secondary"></div>
          <div className="hero-content text-center text-secondary-content">
            <div className="max-w-lg">
              <h1 className="mb-5 sm:mb-7 text-4xl sm:text-8xl font-bold">
                PaintNFT
              </h1>
              <p className="mb-5 sm:mb-7 sm:text-2xl">Your art, your way.</p>
              <button
                className="btn btn-warning sm:btn-wide"
                onClick={() => accountContext.connect()}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
