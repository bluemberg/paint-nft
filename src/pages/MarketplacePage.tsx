import React, { useState, useEffect, useContext } from "react";
import BasePage from "./BasePage";
import toast from "react-hot-toast";
import img from "../img/mp_bg.jpg";

import { TokenMetadata } from "../components/MintModal";
import { fetchCollectableNfts } from "../utils/tzkt";
import AccountContext from "../context/account-context";
import { buyNft } from "../utils/operations";
import { convertToDedicatedUri } from "./DashboardPage";

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
    const modal = document.getElementById(
      "my_modal_1"
    ) as HTMLDialogElement | null;
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
      <section>
        <div
          className="hero h-96 md:h-[320px] overflow-hidden bg-top"
          style={{
            backgroundImage: `url('${img}')`,
          }}
        >
          <div className="hero-overlay bg-opacity-60 bg-secondary"></div>
          <div className="hero-content text-center text-secondary-content">
            <div className="max-w-md">
              <a>
                <i className="bi bi-easel2 text-8xl"></i>
                <h1 className="mb-5 text-7xl font-bold pt-6">SHOP</h1>
              </a>
              {/* <button className="btn btn-primary">Get Started</button> */}
            </div>
          </div>
        </div>
      </section>

      <div className="text-left pl-24 pt-12">
        <h1 className="text-6xl font-bold pb-5">Marketplace</h1>
        <p className="text-lg pb-1">Browse public NFTs here available for buying. Click on an NFT to see more details.</p>
        <p className="text-lg">Your minted NFTs will also appear here.</p>
      </div>

      <div className="px-24">
        <div className="divider"></div>
      </div>

      {/* GRID OF NFTS */}
      <div className="flex justify-center items-center h-full px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 py-4">
          {nfts.map((nft: NFT, index) => (
            <div
              key={index}
              className="card card-bordered card-normal w-150 bg-base-200 shadow-xl cursor-pointer hover:-translate-y-2"
              onClick={() => openModal(nft)}
            >
              <figure>
                <img
                  src={convertToDedicatedUri(nft.token_info.artifactUri)}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = nft.token_info.artifactUri;
                  }}
                  alt={nft.token_info.name}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{nft.token_info.name}</h2>

                <p className="break-words">
                  <b>Author:</b> {nft.token_info.minter}
                </p>
                {/* <p className="break-words">
                  <b>Description:</b> {nft.token_info.description}
                </p> */}
                <p className="break-words">
                  <b>Creators:</b> {nft.token_info.creators.join(", ")}
                </p>
                {/* <p className="break-words">
                  <b>Tags:</b> {nft.token_info.tags.join(", ")}
                </p> */}
                <p className="break-words">
                  <b>Price:</b> {parseInt(nft.amount, 10) / 1000000} tez
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FOR EACH CARD */}
      {selectedNft && (
        <dialog id="my_modal_1" className="modal">
          <div className="">
            <form method="dialog" className="modal-box bg-base-200">
              <figure>
                <img
                  src={convertToDedicatedUri(selectedNft.token_info.artifactUri)}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = selectedNft.token_info.artifactUri;
                  }}
                  alt={selectedNft.token_info.name}
                  className="h-64 w-full rounded-lg"
                />
              </figure>

              <div className="card-body pt-5 pb-0 mb-0 px-0">
                <h2 className="card-title">{selectedNft.token_info.name}</h2>

                <p className="break-words">
                  <b>Author:</b> {selectedNft.token_info.minter}
                </p>
                <p className="break-words">
                  <b>Description:</b> {selectedNft.token_info.description}
                </p>
                <p className="break-words">
                  <b>Creators:</b> {selectedNft.token_info.creators.join(", ")}
                </p>
                <p className="break-words">
                  <b>Tags:</b> {selectedNft.token_info.tags.join(", ")}
                </p>
                <p className="break-words">
                  <b>Price:</b> {parseInt(selectedNft.amount, 10) / 1000000} tez
                </p>
              </div>
              <div className="modal-action mt-0 mb-0">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-secondary">Close</button>
                <button
                  className={
                    "btn " +
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
            </form>
          </div>
        </dialog>
      )}
    </BasePage>
  );
};

export default MarketplacePage;
