import React, { useContext, useMemo } from 'react';
import Prize from './Prize';
import styles from '../styles/prize.module.scss';
import ModifyContext from '../lib/ModifyContext';

type VisiblePrizesProps ={
    prizes: Prize[],
    players: string[];
    winnerIdx?: number; // 조작을 위한 변수
}

const VisiblePrizes = ({ prizes, players, winnerIdx }:VisiblePrizesProps) => {
  const { setRandomPrizes } = useContext(ModifyContext);
  const randomPrizes = useMemo(() => {
    let result: string[] = [];
    let notingCnt = players.length;
    prizes.forEach((prize) => {
      for (let i = 0; i < prize.count; i += 1) {
        result.push(prize.name);
      }
      notingCnt -= prize.count;
    });
    for (let i = 0; i < notingCnt; i += 1) {
      result.push('꽝');
    }
    result = result.sort(() => Math.random() - 0.5);
    // 조작이 활성화 되었을 때
    if (winnerIdx !== undefined && prizes.length !== 0) {
      // 항상 해당 위치에 꽝이 아닌 것 배치
      const { name } = prizes[0];
      const victorIdx = result.indexOf(name);
      const ogName = result[winnerIdx];
      result[winnerIdx] = name;
      result[victorIdx] = ogName;
    }
    setRandomPrizes(result);
    return result;
  }, [players, prizes, winnerIdx]);

  return (
            <div className={styles.container}
                 style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
                {randomPrizes.map((prize, idx) => (
                    <div key={`r prize ${idx}`}
                         className={styles.wrapper}>
                        <div className={styles.prize}
                             { ... prize !== '꽝' && {
                               style: {
                                 backgroundColor: '#3FC3B3',
                                 color: 'white',
                               },
                             } }>
                            {prize}
                        </div>
                    </div>
                ))}
            </div>
  );
};

export default VisiblePrizes;
