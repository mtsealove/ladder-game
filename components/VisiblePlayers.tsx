import {
  RefObject, useContext, useEffect, useMemo,
} from 'react';
import PlayerColor from './PlayerColor';
import styles from '../styles/home.module.scss';
import Ladder from './Ladder';
import ModifyContext from '../lib/ModifyContext';
import Prize from './Prize';

type VisiblePlayersProps = {
    players: string[];
    selectColors: string[];
    ladderRef: RefObject<Ladder>;
}

// 랜덤으로 사용자를 표출할 컴포넌트
const VisiblePlayers = ({
  players, selectColors, ladderRef,
}: VisiblePlayersProps) => {
  const { randomPrizes, resultVisible } = useContext(ModifyContext);
  const { winnerName, setWinnerIdx } = useContext(ModifyContext);
  const randomPlayers = useMemo<PlayerColor[]>(() => {
    const result: PlayerColor[] = [];
    if (players.length === selectColors.length) {
      let tmp = [...players];
      tmp = tmp.sort(() => {
        const a = Math.random() * 100;
        const b = Math.random() * 100;
        if (a > b) {
          return 1;
        } if (b > a) {
          return -1;
        }
        return 0;
      });
      for (let i = 0; i < tmp.length; i += 1) {
        const pc = new PlayerColor(tmp[i], selectColors[i]);
        result.push(pc);
      }
    }
    return result;
  }, [players, selectColors]);
  // 조작 이름의 시작 포인트 설정
  useEffect(() => {
    if (winnerName) {
      let found = false;
      for (let i = 0; i < randomPlayers.length; i += 1) {
        if (randomPlayers[i].name === winnerName) {
          setWinnerIdx(i);
          found = true;
          break;
        }
      }
      if (!found) {
        setWinnerIdx(undefined);
      }
    }
  }, [winnerName, randomPlayers]);
  const getPrizeName = (idx: number): string => {
    if (players.length !== randomPrizes.length) {
      return '';
    }
    if (ladderRef.current) {
      return randomPrizes[ladderRef.current.getEndPoint(idx)];
    }
    return '';
  };

  return (
        <div className={styles.playerStartContainer}>
            {randomPlayers.map((player, idx) => (
                <div className={styles.playerStart}
                     key={`player c ${idx}`}>
                  {resultVisible && (
                      <div className={styles.result}>
                        {getPrizeName(idx)}
                      </div>
                  )}
                    <div className={styles.playerName}
                         style={{
                           backgroundColor: player.color,
                         }}
                         onClick={() => ladderRef.current?.findPath(idx, player.color, true)}>
                        {player.name}
                    </div>
                </div>
            ))}
        </div>
  );
};

export default VisiblePlayers;
