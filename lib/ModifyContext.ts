import React from 'react';

export type ModifyContextProps = {
    winnerIdx: number|undefined;
    setWinnerIdx: (w: number|undefined)=>void;
    winnerName: string|undefined;
    setWinnerName:(w: string|undefined) => void;
    players: string[],
    setPlayers: (p:string[]) =>void;
}

const ModifyContext = React.createContext<ModifyContextProps>({
  winnerIdx: undefined,
  setWinnerIdx: () => {},
  winnerName: undefined,
  setWinnerName: () => {},
  players: [],
  setPlayers: () => {},
});

export default ModifyContext;
