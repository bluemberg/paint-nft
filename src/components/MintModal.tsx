import React, { useEffect } from "react";
import axios from "axios";

interface Props {
  canvasNftRef: React.RefObject<HTMLCanvasElement>;
  canvasBgRef: React.RefObject<HTMLCanvasElement>;
  canvasDrawRef: React.RefObject<HTMLCanvasElement>;
}

const MintModal = ({ canvasNftRef, canvasBgRef, canvasDrawRef }: Props) => {
  /*
  Minting process: 
  1. Pin the image data to Pinata.
  2. Generate token metadata using the hash of the image (to get the URI).
  3. Pin the generated token metadata to Pinata.
  4. Call the mint entry point using the hash of the token metadata (to get the URI).
  */

  const pinNft = async () => {
    const nftCtx = canvasNftRef.current!.getContext("2d")!;

    // clear the NFT canvas just to make sure there is no drawing fragments
    nftCtx.clearRect(0, 0, nftCtx.canvas.width, nftCtx.canvas.height);

    // combine background and the drawings to form the NFT image
    nftCtx.drawImage(canvasBgRef.current!, 0, 0);
    nftCtx.drawImage(canvasDrawRef.current!, 0, 0);

    const nft = canvasNftRef.current!.toDataURL("image/png");
    const nftBlob = await fetch(nft).then((res) => res.blob());

    // clear the NFT canvas since the blob is already saved
    nftCtx.clearRect(0, 0, nftCtx.canvas.width, nftCtx.canvas.height);

    const data = new FormData();
    data.append("file", nftBlob);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
      wrapWithDirectory: false,
    });

    data.append("pinataOptions", pinataOptions);

    return axios
      .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
        maxBodyLength: "Infinity" as any,
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
        },
      })
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const generateTokenMetadata = () => {};

  const pinTokenMetadata = () => {};

  const mint = () => {};

  return (
    <>
      <label htmlFor="my_modal_6" className="btn btn-primary">
        Mint NFT
      </label>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Mint your NFT.</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>
          <div className="modal-action">
            <label
              htmlFor="my_modal_6"
              className="btn btn-primary"
              onClick={() => pinNft()}
            >
              Mint
            </label>
            <label htmlFor="my_modal_6" className="btn btn-secondary">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default MintModal;
