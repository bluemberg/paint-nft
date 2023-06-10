import React, { useState } from "react";
import BasePage from "./BasePage";

import data from './dummy.json'

interface dummy_nft {
  uri: string;
  title: string;
  author: string;
  price: number;
}

const MarketplacePage = () => {
  const [selectedNft, setSelectedNft] = useState<dummy_nft | null>(null);

  const openModal = (nft: dummy_nft) => {
    setSelectedNft(nft);
  };

  const closeModal = () => {
    setSelectedNft(null);
  };

  return (
    <BasePage>
      <h1 className="text-center text-4xl">Marketplace Page</h1>

      {/* GRID OF NFTS */}
      <div className="flex justify-center items-center h-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {data.map((nft, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg"
              onClick={() => openModal(nft)}
            >
              <img src={nft.uri} alt={nft.title} className="mb-4 rounded-lg" />
              <h2 className="text-lg font-semibold mb-2">{nft.title}</h2>
              <p className="text-gray-600 mb-1">Author: {nft.author}</p>
              <p className="text-gray-600 mb-1">Price: {nft.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL/CARD FOR EACH NFT */}
      {selectedNft && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg max-w-sm overflow-y-auto max-h-full mt-20">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              Close
            </button>
            <img src={selectedNft.uri} alt={selectedNft.title} className="mb-4 rounded-lg" />
            <h2 className="text-lg font-semibold mb-2">{selectedNft.title}</h2>
            <p className="text-gray-600 mb-1">Author: {selectedNft.author}</p>
            <p className="text-gray-600 mb-1">Price: {selectedNft.price}</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white py-2 px-4 rounded mr-2" onClick={closeModal}>
                Close
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                Buy
              </button>
            </div>
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default MarketplacePage;
