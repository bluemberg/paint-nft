import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { wallet, tezos, connectWallet } from "../utils/wallet";

interface AccountContextType {
  address: string;
  balance: number;
  isConnected: boolean;
  fetchAccount: () => Promise<boolean>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const context: AccountContextType = {
  address: "",
  balance: 0,
  isConnected: false,
  fetchAccount: async () => false,
  connect: async () => {},
  disconnect: async () => {},
};

const AccountContext = createContext(context);

interface Props {
  children: React.ReactNode;
}

export const AccountContextProvider: React.FC<Props> = (props) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();

  // returns true if fetching is successful (i.e. account is connected)
  const fetchAccount = async () => {
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      const accountAddress = activeAccount.address;
      const accountBalance = await tezos.tz.getBalance(accountAddress);

      setAddress(accountAddress);
      setBalance(accountBalance.toNumber());
      setIsConnected(true);
      return true;
    } else {
      disconnect();
      return false;
    }
  };

  const connect = async () => {
    await connectWallet();
    await fetchAccount();
    navigate("/dashboard");
  };

  const disconnect = async () => {
    await wallet.clearActiveAccount();
    setAddress("");
    setBalance(0);
    setIsConnected(false);
    navigate("/");
  };

  const context: AccountContextType = {
    address,
    balance,
    isConnected,
    fetchAccount,
    connect,
    disconnect,
  };

  return (
    <AccountContext.Provider value={context}>
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
