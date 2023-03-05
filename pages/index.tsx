import type { NextPage } from 'next';
import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NextSeo } from 'next-seo';
import { Combination } from 'js-combinatorics';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import styles from '../styles/home.module.scss';
import Ladder from '../components/Ladder';
import Prize from '../components/Prize';
import ModifyContext from '../lib/ModifyContext';
import SetupSection from '../components/SetupSection';

const VisiblePlayers = dynamic(() => import('../components/VisiblePlayers'), {
  ssr: false,
});
const VisiblePrizes = dynamic(() => import('../components/VisiblePrizes'), {
  ssr: false,
});

// 라인 컬러 조합
const COLORS: string[] = ['#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1',
  '#30A9DE', '#EFDC05', '#E53A40', '#F6B352',
  '#F68657', '#C16200', '#D81159', '#4F86C6',
  '#F16B6F', '#77AAAD', '#CBA6C3', '#3B4E32',
  '#534847', '#ede574', '#5e5e5f', '#e94e77',
];

const Home: NextPage = () => {
  const {
    players, winnerIdx, setResultVisible, resultVisible,
  } = useContext(ModifyContext);
  const router = useRouter();
  const [start, setStart] = useState<boolean>(false);
  const ladderRef = useRef<Ladder>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const selectColors = useMemo(() => {
    const comb = new Combination(COLORS, players.length);
    return comb.at(Math.floor(Math.random() * Number(comb.length)))!;
  }, [players]);
  // 조작 엔드포인트
  const winnerEndPoint = useMemo<number|undefined>(() => {
    if (winnerIdx && ladderRef.current) {
      return ladderRef.current.getEndPoint(winnerIdx);
    }
    return undefined;
  }, [winnerIdx]);
  return (
      <main>
          <NextSeo title='해시의 사다리 타기' />
          <div className={styles.header}>
              <SetupSection prizes={prizes}
                            setPrizes={setPrizes}
                            setStart={setStart} />
          </div>
          {/* 실제 사다리 */}
          <div className={`${styles.game} ${start && styles.gameStart}`}>
              {/*
              <button className={styles.share}
                      onClick={takeScreenShot}>
                  결과 공유
              </button> */}
              {start && (
                  <div className={styles.restartContainer}>
                      <button className={styles.restart}
                              onClick={router.reload}>
                          다시하기
                      </button>
                      <button className={styles.restart}
                              onClick={() => setResultVisible(!resultVisible)}>
                          전체 표시
                      </button>
                  </div>
              )}
              <section className={styles.container}>
                  <VisiblePlayers players={players}
                                  selectColors={selectColors}
                                  ladderRef={ladderRef} />
                  <Ladder players={players}
                          selectColors={selectColors}
                          ref={ladderRef}/>
                  <VisiblePrizes prizes={prizes}
                                 winnerIdx={winnerEndPoint}
                                 players={players} />
              </section>
          </div>
      </main>
  );
};

export default Home;
