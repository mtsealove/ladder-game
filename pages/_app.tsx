import '../styles/globals.css';
import '../styles/fonts.scss';
import type { AppProps } from 'next/app';
import { useMemo, useState } from 'react';
import ModifyContext, { ModifyContextProps } from '../lib/ModifyContext';
import Prize from '../components/Prize';

function MyApp({ Component, pageProps }: AppProps) {
  const [winnerIdx, setWinnerIdx] = useState<number|undefined>(undefined);
  const [winnerName, setWinnerName] = useState<string|undefined>(undefined);
  const [players, setPlayers] = useState<string[]>([]);
  const [randomPrizes, setRandomPrizes] = useState<string[]>([]);
  const [resultVisible, setResultVisible] = useState<boolean>(false);
  const contextValue = useMemo<ModifyContextProps>(() => (
    {
      winnerName,
      setWinnerName,
      winnerIdx,
      setWinnerIdx,
      players,
      setPlayers,
      setRandomPrizes,
      randomPrizes,
      resultVisible,
      setResultVisible,
    }
  ), [winnerIdx, winnerName, players, randomPrizes, resultVisible]);
  return (
      <ModifyContext.Provider value={contextValue}>
        <Component {...pageProps} />
      </ModifyContext.Provider>
  );
}

export default MyApp;
