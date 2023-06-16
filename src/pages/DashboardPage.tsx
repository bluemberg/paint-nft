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
    const modal = document.getElementById('my_modal_1') as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
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
    <section>
        <div
          className="hero h-96 md:h-[500px] overflow-hidden"
          style={{
            backgroundImage: `url("https://img.freepik.com/free-vector/linear-vintage-vaporwave-background_23-2148896937.jpg?w=996&t=st=1686891130~exp=1686891730~hmac=8b4008f79cfa156b383b2918d142da1369920f09c6f66bbecf2cb2f12c6ccca5")`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <a>
                <i className="bi bi-ui-checks-grid text-8xl"></i>
                <h1 className="mb-5 text-7xl font-bold p-6">DASHBOARD</h1>
              </a>
                {/* <button className="btn btn-primary">Get Started</button> */}
            </div>
          </div>
          </div>
      </section>
      
      <h1 className="text-left text-6xl font-bold pl-20 pt-12">My NFTs</h1>
      
      <div className="px-20">
        <div className="divider"></div>
      </div>

      {/* Personal NFTs Grid */}
      <div className="flex justify-center items-center h-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-10 py-4">
          {nfts.map((nft: NFT, index) => (
            <div
              key={index}
              className="card card-bordered card-normal w-150 bg-base-100 shadow-xl cursor-pointer hover:bg-base-300 hover:scale-x transform transition duration-y"
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

                <p className="break-words"><b>Author:</b>  {nft.token_info.minter}</p>
                <p className="break-words"><b>Description:</b> {nft.token_info.description}</p>
                <p className="break-words"><b>Creators:</b>  {nft.token_info.creators.join(', ')}</p>
                <p className="break-words"><b>Tags:</b> {nft.token_info.tags.join(', ')}</p>
                <p ><b>Price:</b>  {parseInt(nft.amount, 10) / 1000000} tez</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-left text-6xl font-bold pl-20 pt-12">Burnt NFTs</h1>
      
      <div className="px-20">
        <div className="divider"></div>
      </div>
        
      <div className="flex justify-center items-center h-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-10 py-4">
          {burnedNfts.map((nft: NFT, index) => (
            <div
              key={index}
              className="card card-bordered card-normal w-150 bg-base-100 shadow-xl cursor-pointer hover:bg-base-300 hover:scale-x transform transition duration-y"
              onClick={() => { }}
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

                <p className="break-words"><b>Author:</b>  {nft.token_info.minter}</p>
                <p className="break-words"><b>Description:</b> {nft.token_info.description}</p>
                <p className="break-words"><b>Creators:</b>  {nft.token_info.creators.join(', ')}</p>
                <p className="break-words"><b>Tags:</b> {nft.token_info.tags.join(', ')}</p>
                <p ><b>Price:</b>  {parseInt(nft.amount, 10) / 1000000} tez</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNft && (
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

              <p className="break-words"><b>Author:</b>  {selectedNft.token_info.minter}</p>
              <p className="break-words"><b>Description:</b> {selectedNft.token_info.description}</p>
              <p className="break-words"><b>Creators:</b>  {selectedNft.token_info.creators.join(', ')}</p>
              <p className="break-words"><b>Tags:</b> {selectedNft.token_info.tags.join(', ')}</p>
              <p className="break-words"><b>Price:</b>  {parseInt(selectedNft.amount, 10) / 1000000} tez</p>
            </div>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-secondary">Close</button>
              <button className={
                "btn " +
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
                }>
                Burn</button>
            </div>
          </form>
        </dialog>
      )}
    </BasePage>
  );
};

export default DashboardPage;
