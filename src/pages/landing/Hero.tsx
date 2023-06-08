import React from 'react';

export default function Hero() {
  return (
    <section>
      <div className='container'>
        <div className="hero h-96 md:h-[500px] rounded-box overflow-hidden" style={{ backgroundImage: `url("https://img.freepik.com/free-vector/gradient-isometric-nft-concept_52683-62009.jpg?w=996&t=st=1686213831~exp=1686214431~hmac=0ece240e71ab1dc8179065b9c913db781fb4e32c18133b74c9bfe2f19d7520cd")` }}>
          <div className="hero-overlay bg-opacity-80"></div>
          <div className="hero-content text-center text-primary-content">
            <div className="max-w-lg">
              <h1 className="mb-5 sm:mb-7 text-8xl sm:text-8xl font-bold">
                PaintNFT
              </h1>
              <p className="mb-5 sm:mb-7 sm:text-xl">
                Your art, your way.
              </p>
              <button className="btn btn-info sm:btn-wide">Connect Wallet</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}