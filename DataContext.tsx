import React, { createContext, useState, ReactNode } from 'react';

interface ArtworkData {
  artistName: string;
  artworkTitle: string;
  artworkDescription: string;
  artistDescription: string;
  artworkBackground: string;
  appreciationPoint: string;
  artHistory: string;
}

interface DataContextType {
  artworkData: ArtworkData | null;
  setArtworkData: React.Dispatch<React.SetStateAction<ArtworkData | null>>;
}

export const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [artworkData, setArtworkData] = useState<ArtworkData | null>(null);

  return (
    <DataContext.Provider value={{ artworkData, setArtworkData }}>
      {children}
    </DataContext.Provider>
  );
};
