import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useMemo, useState } from 'react';
import ModifyContext, { ModifyContextProps } from '../lib/ModifyContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [winnerIdx, setWinnerIdx] = useState<number|undefined>(undefined);
  const [winnerName, setWinnerName] = useState<string|undefined>(undefined);
  const [players, setPlayers] = useState<string[]>([]);
  const contextValue = useMemo<ModifyContextProps>(() => (
    {
      winnerName,
      setWinnerName,
      winnerIdx,
      setWinnerIdx,
      players,
      setPlayers,
    }
  ), [winnerIdx, winnerName, players]);
  return (
      <ModifyContext.Provider value={contextValue}>
        <Component {...pageProps} />
      </ModifyContext.Provider>
  );
}

export default MyApp;
