import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { NetworkType } from "@airgap/beacon-dapp";

export const network = NetworkType.GHOSTNET;
export const marketplaceAddr = "KT1QZiBydEN8p7ae3FNU7pHJ4mkuDE6TooEx";
export const rpcUrl = `https://${network}.smartpy.io`;
export const wallet = new BeaconWallet({
  name: "Paint NFT",
  preferredNetwork: network,
});
export const tezos = new TezosToolkit(rpcUrl);
tezos.setWalletProvider(wallet);

export const connectWallet = async () => {
  await wallet.requestPermissions({
    network: { type: network, rpcUrl: rpcUrl },
  });
};
