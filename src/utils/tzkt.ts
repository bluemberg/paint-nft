import axios from "axios";

import { bytes2Char } from "@taquito/utils";

import { network, marketplaceAddr, tokenAddr } from "./wallet";

export const fetchMarketplaceContractData = async () => {
  const res = await axios
    .get(
      `https://api.${network}.tzkt.io/v1/contracts/${marketplaceAddr}/bigmaps/data/keys`
    )
    .then((res) => res.data);

  const marketplaceData = res.map((key: any) => key.value);
  return marketplaceData;
};

export const fetchTokenContractData = async () => {
  const res = await axios
    .get(
      `https://api.${network}.tzkt.io/v1/contracts/${tokenAddr}/bigmaps/token_metadata/keys`
    )
    .then((res) => res.data);

  const promises = res.map(async (key: any) => ({
    ...key.value,
    token_info: await axios
      .get(bytes2Char(key.value.token_info[""]))
      .then((res) => res.data),
  }));
  const tokenData = await Promise.all(promises);
  return tokenData;
};

export const fetchCollectableNfts = async () => {
  // fetch all collectable NFTs to be displayed on the marketplace

  const marketplaceData = (await fetchMarketplaceContractData()).filter(
    (nft: any) => nft.collectable
  );
  const tokenData = await fetchTokenContractData();

  // combine the above data to retrieve all data for each collectable NFT
  const collectableNfts = marketplaceData.map((collectable: any) => ({
    ...collectable,
    token_info: tokenData.filter(
      (token: any) => token.token_id === collectable.token_id
    )[0].token_info,
  }));

  return collectableNfts;
};

// users can burn the NFTs they hold
// thus we need to fetch their personal NFTs
export const fetchPersonalNfts = async () => {};
