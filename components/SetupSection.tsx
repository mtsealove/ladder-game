import { useContext, useRef, useState } from 'react';
import styles from '../styles/home.module.scss';
import Prize from './Prize';
import ModifyContext from '../lib/ModifyContext';

type SetupSection = {
    prizes: Prize[];
    setPrizes: (p:Prize[]) =>void;
    setStart: (s: boolean) => void;
}

const SetupSection = ({ prizes, setPrizes, setStart }:SetupSection) => {
  const {
    players, setPlayers, setWinnerName, winnerName,
  } = useContext(ModifyContext);
  const [playerName, setPlayerName] = useState<string>('');
  const [prizeName, setPrizeName] = useState<string>('');
  const [showModify, setShowModify] = useState<boolean>(false);
  const prizeRef = useRef<HTMLInputElement>(null);
  // 사용자 추가
  const addPlayer = () => {
    if (players.length === 40) {
      window.alert('최대 40명의 플레이어가 참여할 수 있습니다');
    } else if (playerName.length === 0) {
      window.alert('그래도 이름은 입력해야죠...');
    } else if (players.indexOf(playerName) !== -1) {
      window.alert('이미 있어요!');
    } else {
      const tmp: string[] = [...players];
      tmp.push(playerName);
      setPlayers(tmp);
      setPlayerName('');
    }
  };
    // 사용자 삭제
  const removePlayer = (name: string) => {
    let tmp: string[] = [...players];
    tmp = tmp.filter((p) => name !== p);
    setPlayers(tmp);
  };
    // 상품 추가
  const addPrize = () => {
    if (prizeName.length === 0) {
      window.alert('경품이 뭔데요?');
      return;
    }
    for (let i = 0; i < prizes.length; i += 1) {
      if (prizes[i].name === prizeName) {
        window.alert('이미 있는 경품이예요!!');
        return;
      }
    }
    const p = new Prize(prizeName);
    const tmp: Prize[] = [...prizes];
    tmp.push(p);
    setPrizes(tmp);
    setPrizeName('');
  };
  // 상품 삭제
  const removePrize = (prize: Prize) => {
    let tmp: Prize[] = [...prizes];
    tmp = tmp.filter((p) => p.name !== prize.name);
    setPrizes(tmp);
  };
  // 경품 수량 추가
  const cntUpPrize = (prize: Prize) => {
    const tmp: Prize[] = [...prizes];
    const idx = prizes.indexOf(prize);
    let cntSum = 0;
    prizes.forEach((p) => {
      cntSum += p.count;
    });
    if (players.length <= cntSum) {
      window.alert('경품의 개수가 사용자 수보다 많으면 안되죠');
      return;
    }
    prize.count += 1;
    tmp[idx] = prize;
    setPrizes(tmp);
  };
  // 상품 개수 증감
  const cntDownPrize = (prize: Prize) => {
    const tmp: Prize[] = [...prizes];
    const idx = prizes.indexOf(prize);
    if (prize.count < 2) {
      window.alert('0개는 삭제잖아요?');
      return;
    }
    prize.count -= 1;
    tmp[idx] = prize;
    setPrizes(tmp);
  };
  const startGame = () => {
    if (players.length < 2) {
      window.alert('사용자는 2명 이상이여야 합니다');
      return;
    }
    if (prizes.length === 0) {
      window.alert('경품이 없을 수는 없죠!');
      return;
    }
    setStart(true);
  };
  return (
        <section className={styles.container}>
            <h1 className={styles.title}>사다리 타기 게임</h1>
            {/* 사용자 추가 */}
            <div className={styles.inputContainer}>
                <input value={playerName}
                       placeholder='플레이어 추가'
                       className={styles.input}
                       onKeyDown={(e) => {
                         if (e.key === 'Tab') {
                           e.preventDefault();
                           e.stopPropagation();
                           prizeRef.current?.focus();
                         }
                       }}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter') {
                           addPlayer();
                           e.preventDefault();
                           e.stopPropagation();
                         }
                       }}
                       onChange={(e) => setPlayerName(e.target.value)}
                />
                <button onClick={addPlayer}
                        className={styles.inputBtn}>
                    추가
                </button>
            </div>
            {/* 사용자 목록 */}
            <div className={styles.playerContainer}>
                {players.map((player, idx) => (
                    <div key={`player ${idx}`}
                         className={styles.player}>
                        <span>{player}</span>
                        <button className={styles.playerRemove}
                                onClick={() => removePlayer(player)}>
                            삭제
                        </button>
                    </div>
                ))}
            </div>
            <br/><br/>
            {/* 경품 추가 */}
            <div className={styles.inputContainer}>
                <input onChange={(e) => setPrizeName(e.target.value)}
                       value={prizeName}
                       ref={prizeRef}
                       placeholder='경품 추가'
                       className={styles.input}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter') {
                           addPrize();
                         }
                       }}
                />
                <button onClick={addPrize}
                        className={styles.inputBtn}>
                    추가
                </button>
            </div>
            <div className={styles.playerContainer}
                 style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {prizes.map((prize, idx) => (
                    <div key={`prize ${idx}`}
                         className={styles.player}>
                        <span>{prize.name}</span>
                        <button className={styles.sub}
                                onClick={() => cntDownPrize(prize)}>
                            -
                        </button>
                        <em>{prize.count}</em>
                        <button className={styles.add}
                                onClick={() => cntUpPrize(prize)}>
                            +
                        </button>
                        <button className={styles.playerRemove}
                                style={{ padding: '13px 12px' }}
                                onClick={() => removePrize(prize)}>
                            삭제
                        </button>
                    </div>
                ))}
            </div>
            {showModify && (
                <input onChange={(e) => setWinnerName(e.target.value)}
                       value={winnerName}
                       placeholder='우승자 조작'
                       className={styles.modifyInput}/>
            )}
            <div className={styles.modify}
                 onDoubleClick={() => setShowModify(!showModify)}>
            </div>
            <button className={styles.start}
                    onClick={startGame}>게임 시작</button>
        </section>
  );
};

export default SetupSection;
