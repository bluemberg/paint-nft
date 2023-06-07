import { createContext, useState, Dispatch, SetStateAction } from "react";

interface AccountContextType {
  address: string;
  balance: number;
  isConnected: boolean;
  setAddress: Dispatch<SetStateAction<string>>;
  setBalance: Dispatch<SetStateAction<number>>;
  setIsConnected: Dispatch<SetStateAction<boolean>>;
}

const context: AccountContextType = {
  address: "",
  balance: 0,
  isConnected: false,
  setAddress: () => {},
  setBalance: () => {},
  setIsConnected: () => {},
};

const AccountContext = createContext(context);

interface Props {
  children: React.ReactNode;
}

export const AccountContextProvider: React.FC<Props> = (props) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const context: AccountContextType = {
    address,
    balance,
    isConnected,
    setAddress,
    setBalance,
    setIsConnected,
  };

  return (
    <AccountContext.Provider value={context}>
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
