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
          <div className="card bg-base-200 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="card-body items-center text-center gap-4">
              <i className='bi bi-search text-4xl'></i>
              <h2 className="card-title">Canvas</h2>
              <p>
                This is a wider card with <br className='hidden xl:inline' />supporting text below as a <br className='hidden xl:inline' /> natural content.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="card-body items-center text-center gap-4">
              <i className='bi bi-chat-left-dots text-4xl'></i>
              <h2 className="card-title">Marketplace</h2>
              <p>
                This is a wider card with <br className='hidden xl:inline' />supporting text below as a <br className='hidden xl:inline' /> natural content.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="card-body items-center text-center gap-4">
              <i className='bi bi-badge-ad text-4xl'></i>
              <h2 className="card-title">Minting</h2>
              <p>
                This is a wider card with <br className='hidden xl:inline' />supporting text below as a <br className='hidden xl:inline' /> natural content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}