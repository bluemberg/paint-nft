import { createContext, useState, Dispatch, SetStateAction } from "react";

// need to set this
interface MarketplaceStorage {}

interface MarketplaceContextType {
  storage: MarketplaceStorage;
  setStorage: Dispatch<SetStateAction<MarketplaceStorage>>;
}

const context: MarketplaceContextType = {
  storage: {},
  setStorage: () => {},
};

const MarketplaceContext = createContext(context);

interface Props {
  children: React.ReactNode;
}

export const MarketplaceContextProvider: React.FC<Props> = (props) => {
  const [storage, setStorage] = useState({});

  const context: MarketplaceContextType = {
    storage,
    setStorage,
  };

  return (
    <MarketplaceContext.Provider value={context}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceContext;
