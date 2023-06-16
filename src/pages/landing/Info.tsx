import React from 'react';

export default function Services() {
  return (
    <section className='py-10 md:py-16'>
      <div className='container'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-5xl font-bold mb-4'>Features</h2>
          <p className='text-lg sm:text-2xl mb-6 md:mb-14'>
            PaintNFT is a web platform that allows users to paint their own NFTs and trade in the marketplace.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10'>
          <div className="card bg-base-300 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="card-body items-center text-center gap-4">
              <i className='bi bi-brush text-4xl'></i>
              <h2 className="card-title">Canvas</h2>
              <p>
                A built-in canvas page that <br className='hidden xl:inline' /> allows you to create and <br className='hidden xl:inline' /> publish your own art with ease.
              </p>
            </div>
          </div>

          <div className="card bg-base-300 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="card-body items-center text-center gap-4">
              <i className='bi bi-shop-window text-4xl'></i>
              <h2 className="card-title">Marketplace</h2>
              <p>
                A marketplace that stores all <br className='hidden xl:inline' />the art NFTs to make buying, <br className='hidden xl:inline' /> selling, and trading a smooth experience.
              </p>
            </div>
          </div>

          <div className="card bg-base-300 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="card-body items-center text-center gap-4">
              <i className='bi bi bi-fingerprint text-4xl'></i>
              <h2 className="card-title">Security</h2>
              <p>
                A state-of-the art authentication <br className='hidden xl:inline' /> and security so that you don't <br className='hidden xl:inline' /> have to worry about your safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}