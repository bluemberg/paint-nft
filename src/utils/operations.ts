import { char2Bytes } from "@taquito/utils";

import { tezos, marketplaceAddr } from "./wallet";

export const mintNft = async (tokenMetadataUri: string, price: number) => {
  try {
    const marketplace = await tezos.wallet.at(marketplaceAddr);
    const op = await marketplace.methods
      .mint_nft(price, char2Bytes(tokenMetadataUri))
      .send();
    await op.confirmation(3);
  } catch (err) {
    throw err;
  }
};

// TODO
export const burnNft = () => {};
export const buyNft = () => {};
