import { useContext } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { NetworkType } from "@airgap/beacon-dapp";

import WalletContext from "../context/wallet-context";
import AccountContext from "../context/account-context";

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
  const accountContext = useContext(AccountContext);
  const walletContext = useContext(WalletContext);
  try {
    await wallet.requestPermissions({
      network: { type: network, rpcUrl: rpcUrl },
    });
    const accountAddress = await wallet.getPKH();
    accountContext.setAddress(accountAddress);
    accountContext.setIsConnected(true);
    const balance = await tezos.tz.getBalance(accountAddress);
    accountContext.setBalance(balance.toNumber());

    walletContext.setWallet(wallet);
    walletContext.setBeaconConnection(true);
  } catch (error) {
    console.log(error);
    accountContext.setAddress("");
    accountContext.setIsConnected(false);
    accountContext.setBalance(0);

    walletContext.setWallet(null);
    walletContext.setBeaconConnection(false);
  }
};

export const disconnectWallet = async () => {
  const accountContext = useContext(AccountContext);
  const walletContext = useContext(WalletContext);
  if (walletContext.wallet) {
    await walletContext.wallet.clearActiveAccount();
  }
  accountContext.setAddress("");
  accountContext.setIsConnected(false);
  accountContext.setBalance(0);

  walletContext.setWallet(null);
  walletContext.setBeaconConnection(false);
};

export const getAccountAddr = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    const accountAddr = await wallet.getPKH();
    return accountAddr;
  } else {
    return "";
  }
};
