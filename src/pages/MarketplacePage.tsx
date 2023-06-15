import React, { useState, useEffect, useContext } from "react";
import BasePage from "./BasePage";
import toast from "react-hot-toast";

import { TokenMetadata } from "../components/MintModal";
import { fetchCollectableNfts } from "../utils/tzkt";
import AccountContext from "../context/account-context";
import { buyNft } from "../utils/operations";

export interface NFT {
  amount: string;
  author: string;
  collectable: boolean;
  holder: string;
  token_id: string;
  token_info: TokenMetadata;
}

const MarketplacePage = () => {
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const accountContext = useContext(AccountContext);

  const openModal = (nft: NFT) => {
    setSelectedNft(nft);
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = () => {
    setSelectedNft(null);
  };

  useEffect(() => {
    toast.promise(
      (async () => {
        // these are all the NFTs that need to be displayed to this page
        const nfts = await fetchCollectableNfts();
        setNfts(nfts);
      })(),
      {
        loading: "Loading NFTs.",
        success: "Successfully loaded all NFTs!",
        error: "Error retrieving NFTs.",
      }
    );
  }, []);

  return (
    <BasePage>
      <h1 className="text-center text-4xl">Marketplace Page</h1>

      {/* GRID OF NFTS */}
      <div className="flex justify-center items-center h-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-10">
          {nfts.map((nft: NFT, index) => (
            <div
              key={index}
              className="card card-bordered card-normal w-150 bg-base-100 shadow-xl"
              onClick={() => openModal(nft)}
            >
              <figure>
                <img
                src={nft.token_info.artifactUri}
                alt={nft.token_info.name}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">
                  {nft.token_info.name}
                </h2>

                <p className="truncate"><b>Author:</b>  {nft.token_info.minter}</p>
                <p><b>Description:</b> {nft.token_info.description}</p>
                <p><b>Creators:</b>  {nft.token_info.creators.join(', ')}</p>
                <p><b>Tags:</b> {nft.token_info.tags.join(', ')}</p>
                <p><b>Price:</b>  {nft.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL/CARD FOR EACH NFT
      {selectedNft && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg max-w-sm overflow-y-auto max-h-full mt-20">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              Close
            </button>
            <img
              src={selectedNft.token_info.artifactUri}
              alt={selectedNft.token_info.name}
              className="mb-4 rounded-lg"
            />
            <h2 className="text-lg font-semibold mb-2">
              {selectedNft.token_info.name}
            </h2>
            <p className="text-gray-600 mb-1">
              Author: {selectedNft.token_info.minter}
            </p>
            <p className="text-gray-600 mb-1">Price: {selectedNft.amount}</p>
            <div className="flex justify-end">
              <button
                className="btn btn-secondary py-2 px-4 rounded mr-2"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className={
                  "btn  text-white py-2 px-4 rounded " +
                  (selectedNft.token_info.minter === accountContext.address
                    ? "btn-disabled"
                    : "btn-primary")
                }
                onClick={() =>
                  toast.promise(
                    buyNft(
                      parseInt(selectedNft.token_id),
                      parseInt(selectedNft.amount) + 10_00000 // one 1 tez to the price for gas fee
                    ),
                    {
                      loading: "Buying NFT.",
                      success: "Successfully bought NFT!",
                      error: "Error buying NFT.",
                    }
                  )
                }
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* MODAL FOR EACH CARD */}
      {selectedNft &&(
        <dialog id="my_modal_1" className="modal">
          <form method="dialog" className="modal-box">
            <figure>
                <img
                src={selectedNft.token_info.artifactUri}
                alt={selectedNft.token_info.name}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">
                  {selectedNft.token_info.name}
                </h2>

                <p className="truncate"><b>Author:</b>  {selectedNft.token_info.minter}</p>
                <p><b>Description:</b> {selectedNft.token_info.description}</p>
                <p><b>Creators:</b>  {selectedNft.token_info.creators.join(', ')}</p>
                <p><b>Tags:</b> {selectedNft.token_info.tags.join(', ')}</p>
                <p><b>Price:</b>  {selectedNft.amount}</p>
              </div>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              <button className={
                "btn-primary"
                + (selectedNft.token_info.minter === accountContext.address
                  ? "btn-disabled"
                  : "btn-primary")
                 }
                 onClick={() =>
                  toast.promise(
                    buyNft(
                      parseInt(selectedNft.token_id),
                      parseInt(selectedNft.amount) + 10_00000 // one 1 tez to the price for gas fee
                    ),
                    {
                      loading: "Buying NFT.",
                      success: "Successfully bought NFT!",
                      error: "Error buying NFT.",
                    }
                  )
                }>
                Buy</button>
            </div>
          </form>
        </dialog>
      )}

    </BasePage>
  );
};

export default MarketplacePage;
