import { char2Bytes } from "@taquito/utils";

import { tezos, marketplaceAddr } from "./wallet";

export const mintNft = async (tokenMetadataUri: string, price: number) => {
  try {
    const marketplace = await tezos.wallet.at(marketplaceAddr);
    const op = await marketplace.methods
      .mint_nft(price, char2Bytes(tokenMetadataUri))
      .send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const buyNft = async (tokenId: number, amount: number) => {
  try {
    const marketplace = await tezos.wallet.at(marketplaceAddr);
    const op = await marketplace.methods.buy_nft(tokenId).send({
      amount,
      mutez: true,
    });
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const burnNft = async (tokenId: number) => {
  try {
    const marketplace = await tezos.wallet.at(marketplaceAddr);
    const op = await marketplace.methods.burn_nft(tokenId).send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};
