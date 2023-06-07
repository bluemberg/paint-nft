import { createContext, useState, Dispatch, SetStateAction } from "react";

import { BeaconWallet } from "@taquito/beacon-wallet";

interface WalletContextType {
  wallet: BeaconWallet | null;
  beaconConnection: boolean;
  setWallet: Dispatch<SetStateAction<BeaconWallet | null>>;
  setBeaconConnection: Dispatch<SetStateAction<boolean>>;
}

const context: WalletContextType = {
  wallet: null,
  beaconConnection: false,
  setWallet: () => {},
  setBeaconConnection: () => {},
};

const WalletContext = createContext(context);

interface Props {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<Props> = (props) => {
  const [wallet, setWallet] = useState<null | BeaconWallet>(null);
  const [beaconConnection, setBeaconConnection] = useState(false);

  const context: WalletContextType = {
    wallet,
    beaconConnection,
    setWallet,
    setBeaconConnection,
  };

  return (
    <WalletContext.Provider value={context}>
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
