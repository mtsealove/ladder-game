import React from 'react';
import Prize from '../components/Prize';

export type ModifyContextProps = {
    winnerIdx: number|undefined;
    setWinnerIdx: (w: number|undefined)=>void;
    winnerName: string|undefined;
    setWinnerName:(w: string|undefined) => void;
    players: string[],
    setPlayers: (p:string[]) =>void;
    randomPrizes: string[];
    setRandomPrizes: (p: string[]) => void;
    resultVisible: boolean;
    setResultVisible: (v: boolean) => void;
}

const ModifyContext = React.createContext<ModifyContextProps>({
  winnerIdx: undefined,
  setWinnerIdx: () => {},
  winnerName: undefined,
  setWinnerName: () => {},
  players: [],
  setPlayers: () => {},
  randomPrizes: [],
  setRandomPrizes: () => {},
  resultVisible: false,
  setResultVisible: () => {},
});

export default ModifyContext;
