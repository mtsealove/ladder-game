import type { NextPage } from 'next';
import {
  useState,
} from 'react';
import styles from '../styles/home.module.scss';
import Ladder from '../components/Ladder';

const Home: NextPage = () => {
  const [players, setPlayers] = useState<string[]>(['나', '나나', '나나나나', '나나나나', '나나나나나', '아몰랑']);
  const [playerName, setPlayerName] = useState<string>('');
  // 사용자 추가
  const addPlayer = () => {
    if (playerName.length === 0) {
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
  return (
      <main className={styles.container}>
          {/* 사용자 추가 */}
          <div>
            <input onChange={(e) => setPlayerName(e.target.value)}
                   value={playerName}
                   placeholder='플레이어 추가'
            />
            <button onClick={addPlayer}>추가</button>
          </div>
          {/* 실제 사다리 */}
          <Ladder players={players} />
      </main>
  );
};

export default Home;
