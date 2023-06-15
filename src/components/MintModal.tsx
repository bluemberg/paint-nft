import React, { useEffect, useContext, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import AccountContext from "../context/account-context";
import { mintNft } from "../utils/operations";

interface Props {
  canvasNftRef: React.RefObject<HTMLCanvasElement>;
  canvasBgRef: React.RefObject<HTMLCanvasElement>;
  canvasDrawRef: React.RefObject<HTMLCanvasElement>;
}

interface Format {
  uri: string;
  hash: string;
  mimeType: string; // always "image/png" in our case
  dimensions: { value: string; unit: string };
  fileSize: number;
}

export interface TokenMetadata {
  name: string;
  symbol?: string; // should be always empty in our case
  decimals: number; // always 0 for NFTs
  artifactUri: string;
  displayUri: string;
  thumbnailUri: string;
  description: string;
  minter: string;
  creators: string[];
  isBooleanAmount: boolean; // always true for NFTs
  formats: Format[];
  tags: string[];
}

const MintModal = ({ canvasNftRef, canvasBgRef, canvasDrawRef }: Props) => {
  const accountContext = useContext(AccountContext);

  const inputTitleRef = useRef<HTMLInputElement>(null);
  const inputDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const inputCreatorsRef = useRef<HTMLTextAreaElement>(null);
  const inputTagsRef = useRef<HTMLTextAreaElement>(null);
  const inputPriceRef = useRef<HTMLInputElement>(null);

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

  const getUri = (ipfsHash: string) => {
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  };

  const generateTokenMetadata = (
    ipfsHash: string,
    pinSize: number,
    timestamp: string
  ) => {
    const creators = inputCreatorsRef.current?.value
      .split(",")
      .map((name: string) => name.trim());
    const tags = inputTagsRef.current?.value
      .split(",")
      .map((name: string) => name.trim());
    const dimension = `${canvasNftRef.current!.width}x${
      canvasNftRef.current!.height
    }`;
    return {
      name: inputTitleRef.current?.value || "",
      // symbol, // this is not required for NFTs
      decimals: 0,
      artifactUri: getUri(ipfsHash),
      displayUri: getUri(ipfsHash),
      thumbnailUri: getUri(ipfsHash),
      description: inputDescriptionRef.current?.value || "",
      minter: accountContext.address,
      creators: creators || [],
      isBooleanAmount: true,
      formats: [
        {
          uri: getUri(ipfsHash),
          hash: ipfsHash,
          mimeType: "image/png",
          dimensions: { value: dimension, unit: "px" },
          fileSize: pinSize,
        },
      ],
      tags: tags || [],
      date: timestamp,
    };
  };

  const pinTokenMetadata = async (tokenMetadata: TokenMetadata) => {
    const data = JSON.stringify({
      pinataOptions: {
        cidVersion: 0,
        wrapWithDirectory: false,
      },
      pinataContent: tokenMetadata,
    });

    return axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
      },
      data: data,
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

  const mint = async () => {
    var config = {
      method: 'get',
      url: 'https://api.pinata.cloud/data/testAuthentication',
      headers: { 
        'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}`
      }
    };
    
    const res = await axios(config)
    
    console.log(res.data);

    const pinNftRes = await pinNft();
    if (pinNftRes.status === 200) {
      const tokenMetadata = generateTokenMetadata(
        pinNftRes.data.IpfsHash,
        pinNftRes.data.PinSize,
        pinNftRes.data.Timestamp
      );

      const pinTokenMetadataRes = await pinTokenMetadata(tokenMetadata);
      if (pinTokenMetadataRes.status === 200) {
        // call the mint entry point
        const tokenMetadataUri = getUri(pinTokenMetadataRes.data.IpfsHash);
        const price = parseInt(inputPriceRef.current?.value || "0");
        await mintNft(tokenMetadataUri, price);
      }
    }
  };

  return (
    <>
      <label htmlFor="my_modal_6" className="btn btn-primary">
        Mint NFT
      </label>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Mint your NFT.</h3>
          <div className="p-1">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title of your NFT.</span>
              </label>
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
                ref={inputTitleRef}
              />
            </div>
          </div>
          <div className="p-1">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description of your NFT.</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Description"
                ref={inputDescriptionRef}
              ></textarea>
            </div>
          </div>
          <div className="p-1">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Creators.</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Creators (separated by comma)"
                ref={inputCreatorsRef}
              ></textarea>
            </div>
          </div>
          <div className="p-1">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tags.</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Tags (separated by comma)"
                ref={inputTagsRef}
              ></textarea>
            </div>
          </div>
          <div className="p-1">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price of your NFT.</span>
              </label>
              <input
                type="number"
                placeholder="Price in mutez"
                className="input input-bordered w-full"
                ref={inputPriceRef}
              />
            </div>
          </div>
          <div className="modal-action">
            <label
              htmlFor="my_modal_6"
              className="btn btn-primary"
              onClick={() =>
                toast.promise(mint(), {
                  loading: "Minting NFT",
                  success: "Successfully minted!",
                  error: "Error when minting.",
                })
              }
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
