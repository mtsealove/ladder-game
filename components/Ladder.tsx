import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Combination } from 'js-combinatorics';
import styles from '../styles/ladder.module.scss';

type LadderProps = {
    players: string[]
}

const LINE_HEIGHT = 15; // 라인의 최대 가상 높이
const PHYSICAL_HEIGHT = 1000; // 라인의 실제 높이
const LINE_COLOR = '#e4e7ec';
// 라인 컬러 조합
const COLORS: string[] = ['#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1',
  '#30A9DE', '#EFDC05', '#E53A40', '#F6B352',
  '#F68657', '#C16200', '#D81159', '#4F86C6',
  '#F16B6F', '#77AAAD', '#CBA6C3', '#3B4E32',
  '#534847', '#ede574', '#5e5e5f', '#e94e77',
];
const Ladder = ({ players }:LadderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectColors = useMemo<string[]>(() => {
    const comb = new Combination(COLORS, players.length);
    return comb.at(Math.floor(Math.random() * players.length))!;
  }, [players]);
    // combination 수행을 위한 배열
  const combArr = useMemo<number[]>(() => {
    const result: number[] = [];
    for (let i = 1; i < LINE_HEIGHT; i += 1) {
      result.push(i);
    }
    return result;
  }, [LINE_HEIGHT]);
    // 랜덤 사다리 생성
  const ladderArray = useMemo<boolean[][]>(() => {
    const result: boolean[][] = [];
    const x = players.length * 2 - 1;
    for (let i = 0; i < x; i += 1) {
      // 플레이어의 하단 라인
      const line: boolean[] = Array.from({ length: LINE_HEIGHT - 1 });
      if (i % 2 === 0) {
        line.fill(true);
      } else {
        // 최대 개수를 2 ~ 4 개로 설정
        line.fill(false);
        const maxLine = 2 + Math.floor(Math.random() * 3);
        while (true) {
          const comb = new Combination(combArr, maxLine);
          const select: number[] = comb.at(Math.floor(Math.random() * Number(comb.length)))!;
          let duplicated = false;
          // 좌측 중복 없이
          if (i >= 2) {
            for (let j = 0; j < select.length; j += 1) {
              if (result[i - 2][select[j]]) {
                duplicated = true;
              }
            }
          }
          // 중복 없을 시 해당 라인을 배열에 추가
          if (!duplicated) {
            for (let j = 0; j < select.length; j += 1) {
              line[select[j]] = true;
            }
            break;
          }
        }
      }
      result.push(line);
    }
    return result;
  }, [players]);
  // canvas에 사다리 실제로 그리기
  const initLadder = () => {
    const { current: canvas } = canvasRef;
    if (canvas) {
      const context = canvas.getContext('2d')!;
      context.clearRect(0, 0, 10000000, 1000000);
      context.beginPath();
      context.strokeStyle = LINE_COLOR;
      context.lineWidth = 20;
      context.lineCap = 'round';
      // 세로선 그리기
      const gap = (canvas.width) / players.length;
      const sidePadding = gap / 2;
      for (let i = 0; i < players.length; i += 1) {
        context?.moveTo(gap * i + sidePadding, 10);
        context.lineTo(gap * i + sidePadding, PHYSICAL_HEIGHT);
        context.stroke();
      }
      // 가로선 그리기
      const hGap = PHYSICAL_HEIGHT / LINE_HEIGHT;
      let xIdx = 0;
      for (let i = 1; i < players.length * 2 - 1; i += 2) {
        const line = ladderArray[i];
        for (let j = 1; j < LINE_HEIGHT; j += 1) {
          if (line[j]) {
            const x = gap * (xIdx) + sidePadding;
            const y = hGap * j;
            context.moveTo(x, y);
            context.lineTo(x + gap, y);
            context.stroke();
          }
        }
        xIdx += 1;
      }
      context.closePath();
    }
  };
  // 길찾기
  const findPath = () => {
    const { current: canvas } = canvasRef;
    if (canvas) {
      const context = canvas.getContext('2d')!;
      const hGap = (canvas.width) / players.length;
      const sidePadding = hGap / 2;
      const vGap = PHYSICAL_HEIGHT / LINE_HEIGHT;

      // context.strokeStyle = 'blue';
      context.lineWidth = 15;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      for (let i = 0; i < players.length; i += 1) {
        context.beginPath();
        context.strokeStyle = selectColors[i];
        let xIdx = i * 2;
        let yIdx = 0;
        while (yIdx <= LINE_HEIGHT) {
          context.moveTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
          if (xIdx >= 2 && ladderArray[xIdx - 1][yIdx]) { // 좌측 검색
            xIdx -= 2;
            context.lineTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
            context.stroke();
            context.moveTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
          } else if (xIdx < players.length * 2 - 2 && ladderArray[xIdx + 1][yIdx]) { // 우측 검색
            context.lineTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
            context.stroke();
            context.moveTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
            xIdx += 2;
          }
          // 하단 이동
          context.lineTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
          context.stroke();
          yIdx += 1;
          context.lineTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
          context.stroke();
        }
      }
    }
  };
  useEffect(() => {
    initLadder();
  }, [ladderArray]);
  return (
        <div className={styles.container}>
            <canvas ref={canvasRef}
                    width={1920}
                    height={1080}
                    className={styles.canvas}>

            </canvas>
            <button onClick={findPath}>결과 확인</button>
        </div>
  );
};

export default Ladder;
