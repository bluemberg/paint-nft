import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import BasePage from "./BasePage";
import { fetchPersonalNfts, fetchBurnedNfts } from "../utils/tzkt";
import AccountContext from "../context/account-context";
import { NFT } from "./MarketplacePage";
import { burnNft } from "../utils/operations";

const DashboardPage = () => {
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [burnedNfts, setBurnedNfts] = useState<NFT[]>([]);

  const accountContext = useContext(AccountContext);

  const openModal = (nft: NFT) => {
    setSelectedNft(nft);
  };

  const closeModal = () => {
    setSelectedNft(null);
  };

  useEffect(() => {
    if (accountContext.address !== "") {
      toast.promise(
        (async () => {
          // these are all the NFTs that need to be displayed to this page
          const nfts = await fetchPersonalNfts(accountContext.address);
          const burnedNfts = await fetchBurnedNfts(accountContext.address);
          setNfts(nfts);
          setBurnedNfts(burnedNfts);
        })(),
        {
          loading: "Loading personal NFTs.",
          success: "Successfully loaded all NFTs!",
          error: "Error retrieving NFTs.",
        }
      );
    }
  }, [accountContext]);

  return (
    <BasePage>
      <h1 className="text-center text-4xl">Dashboard Page</h1>
      <h2 className="text-center text-2xl mt-6">Personal NFTs</h2>
      <div className="flex justify-center items-center h-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {nfts.map((nft: NFT, index) => (
            <div
              key={index}
              className="bg-base-200 border-2 border-slate-300 rounded-lg p-4 cursor-pointer shadow-lg hover:bg-base-300"
              onClick={() => openModal(nft)}
            >
              <img
                src={nft.token_info.artifactUri}
                alt={nft.token_info.name}
                className="mb-4 rounded-lg"
              />
              <h2 className="text-xl font-semibold mb-2">
                {nft.token_info.name}
              </h2>
              <p className="text-base mb-1 break-words">
                Author: {nft.token_info.minter}
              </p>
              <p className="text-base mb-1 break-words">Price: {nft.amount} mutez</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-center text-2xl mt-6">Burned NFTs</h2>
      <div className="flex justify-center items-center h-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          {burnedNfts.map((nft: NFT, index) => (
            <div
              key={index}
              className="bg-base-200 border-2 border-slate-300 rounded-lg p-4 cursor-pointer shadow-lg hover:bg-base-300"
              onClick={() => {}}
            >
              <img
                src={nft.token_info.artifactUri}
                alt={nft.token_info.name}
                className="mb-4 rounded-lg"
              />
              <h2 className="text-xl font-semibold mb-2">
                {nft.token_info.name}
              </h2>
              <p className="text-base mb-1 break-words">
                Author: {nft.token_info.minter}
              </p>
              <p className="text-base mb-1 break-words">Price: {nft.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL/CARD FOR EACH NFT */}
      {selectedNft && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-base-200 p-4 rounded-lg max-w-sm overflow-y-auto max-h-full mt-20 z-50">
            <img
              src={selectedNft.token_info.artifactUri}
              alt={selectedNft.token_info.name}
              className="mb-4 rounded-lg"
            />
            <h2 className="text-xl font-semibold mb-2">
              {selectedNft.token_info.name}
            </h2>
            <p className="text-base mb-1">
              Author: {selectedNft.token_info.minter}
            </p>
            <p className="text-base mb-1">Price: {selectedNft.amount} mutez</p>
            <div className="flex justify-end">
              <button
                className="btn btn-secondary py-2 px-4 rounded mr-2"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className={
                  "btn py-2 px-4 rounded " +
                  (selectedNft.holder === accountContext.address
                    ? "btn-primary"
                    : "btn-disabled")
                }
                onClick={() =>
                  toast.promise(burnNft(parseInt(selectedNft.token_id)), {
                    loading: "Burning NFT.",
                    success: "Successfully burned NFT!",
                    error: "Error burning NFT.",
                  })
                }
              >
                Burn
              </button>
            </div>
          </div>
        </div>
      )}
    </BasePage>
  );
};

export default DashboardPage;
