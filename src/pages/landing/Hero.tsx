import React, { useEffect, useContext } from "react";
import img from "../../img/hero_bg.jpg";
import AccountContext from "../../context/account-context";

export default function Hero() {
  const accountContext = useContext(AccountContext);

  return (
    <section>
      <div className="container">
        <div
          className="hero h-96 md:h-[500px] rounded-box overflow-hidden"
          style={{
            backgroundImage: `url('${img}')`,
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
