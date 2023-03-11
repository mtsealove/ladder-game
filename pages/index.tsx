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
const COLORS: string[] = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF',
  '#4B0082', '#9400D3', '#FFC0CB', '#FF69B4', '#FFA07A', '#A0522D',
  '#8B0000', '#FFD700', '#F0E68C', '#00CED1', '#40E0D0', '#00BFFF',
  '#1E90FF', '#9400D3', '#8A2BE2', '#FF6347', '#8B008B', '#228B22',
  '#7FFF00', '#00FF7F', '#FF1493', '#B22222', '#8FBC8F', '#696969',
  '#2F4F4F', '#FFDAB9', '#DEB887', '#D2B48C', '#B0C4DE', '#BC8F8F',
  '#4682B4', '#FA8072', '#6B8E23', '#9932CC', '#00FFFF',
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
  const winnerEndPoint = useMemo<number | undefined>(() => {
    if (winnerIdx && ladderRef.current) {
      return ladderRef.current.getEndPoint(winnerIdx);
    }
    return undefined;
  }, [winnerIdx]);
  const zoom = useMemo<number>(() => {
    if (players.length > 30) {
      return 0.67;
    } if (players.length > 20) {
      return 0.8;
    }

    return 1;
  }, [players]);
  return (
        <main>
            <NextSeo title='해시의 사다리 타기'/>
            <div className={styles.header}>
                <SetupSection prizes={prizes}
                              setPrizes={setPrizes}
                              setStart={setStart}/>
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
                        <br/>
                        <button className={styles.restart}
                                onClick={() => setResultVisible(!resultVisible)}>
                            전체 표시
                        </button>
                    </div>
                )}
                <section className={styles.container}
                         style={{ zoom }} >
                    <VisiblePlayers players={players}
                                    selectColors={selectColors}
                                    ladderRef={ladderRef}/>
                    <Ladder players={players}
                            selectColors={selectColors}
                            ref={ladderRef}/>
                    <VisiblePrizes prizes={prizes}
                                   winnerIdx={winnerEndPoint}
                                   players={players}/>
                </section>
            </div>
        </main>
  );
};

export default Home;
