import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Combination } from 'js-combinatorics';
import styles from '../styles/ladder.module.scss';

type LadderProps = {
    players: string[],
    selectColors: string[]
}

const LINE_HEIGHT = 15; // 라인의 최대 가상 높이
const PHYSICAL_HEIGHT = 1000; // 라인의 실제 높이
const LINE_COLOR = '#e4e7ec';

class Ladder extends React.Component<LadderProps, any> {
  private canvasRef = React.createRef<HTMLCanvasElement>();

  private canvasBgRef = React.createRef<HTMLCanvasElement>();

  private ladderArray: boolean[][] = [];

  componentDidMount() {
    this.ladderArray = this.generateLadderArray();
    this.initLadder();
  }

  componentDidUpdate(prevProps: Readonly<LadderProps>, prevState: Readonly<any>, snapshot?: any) {
    if (this.props.players.length !== prevProps.players.length) {
      this.ladderArray = this.generateLadderArray();
      this.initLadder();
    }
  }

  // combination 수행을 위한 배열
  private combArr = () => {
    const result: number[] = [];
    for (let i = 1; i < LINE_HEIGHT; i += 1) {
      result.push(i);
    }
    return result;
  };

  // 랜덤 사다리 생성
  private generateLadderArray = () => {
    const result: boolean[][] = [];
    const x = this.props.players.length * 2 - 1;
    for (let i = 0; i < x; i += 1) {
      // 플레이어의 하단 라인
      const line: boolean[] = Array.from({ length: LINE_HEIGHT - 1 });
      if (i % 2 === 0) {
        line.fill(true);
      } else {
        // 최대 개수를 2 ~ 4 개로 설정
        line.fill(false);
        const maxLine = 2 + Math.floor(Math.random() * 3);
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const comb = new Combination(this.combArr(), maxLine);
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
  };

  // canvas에 사다리 실제로 그리기
  private initLadder = () => {
    const { current: canvas } = this.canvasBgRef;
    if (canvas) {
      const context = canvas.getContext('2d')!;
      context.clearRect(0, 0, 10000000, 1000000);
      context.beginPath();
      context.strokeStyle = LINE_COLOR;
      context.lineWidth = 20;
      context.lineCap = 'round';
      // 세로선 그리기
      const gap = (canvas.width) / this.props.players.length;
      const sidePadding = gap / 2;
      for (let i = 0; i < this.props.players.length; i += 1) {
        context?.moveTo(gap * i + sidePadding, 10);
        context.lineTo(gap * i + sidePadding, PHYSICAL_HEIGHT);
        context.stroke();
      }
      // 가로선 그리기
      const hGap = PHYSICAL_HEIGHT / LINE_HEIGHT;
      let xIdx = 0;
      for (let i = 1; i < this.props.players.length * 2 - 1; i += 2) {
        const line = this.ladderArray[i];
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
  public findPath = (idx: number, color: string) => {
    const { current: canvas } = this.canvasRef;
    if (canvas) {
      const context = canvas.getContext('2d')!;
      context.clearRect(0, 0, 10000000, 1000000);
      const hGap = (canvas.width) / this.props.players.length;
      const sidePadding = hGap / 2;
      const vGap = PHYSICAL_HEIGHT / LINE_HEIGHT;
      context.lineWidth = 15;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.beginPath();
      // context.strokeStyle = this.props.selectColors[idx];
      context.strokeStyle = color;
      let xIdx = idx * 2;
      let yIdx = 0;
      while (yIdx <= LINE_HEIGHT) {
        context.moveTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
        if (xIdx >= 2 && this.ladderArray[xIdx - 1][yIdx]) { // 좌측 검색
          xIdx -= 2;
          context.lineTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
          context.stroke();
          context.moveTo(hGap * (xIdx / 2) + sidePadding, yIdx * vGap);
        } else if (xIdx < this.props.players.length * 2 - 2
                    && this.ladderArray[xIdx + 1][yIdx]) { // 우측 검색
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
  };

  // 조작을 위해 특정 시작점에서 도달하는 마지막 계산
  public getEndPoint = (idx: number): number => {
    let xIdx = idx * 2;
    let yIdx = 0;
    while (yIdx <= LINE_HEIGHT) {
      if (xIdx >= 2 && this.ladderArray[xIdx - 1][yIdx]) { // 좌측 검색
        xIdx -= 2;
      } else if (xIdx < this.props.players.length * 2 - 2
          && this.ladderArray[xIdx + 1][yIdx]) {
        xIdx += 2;
      }
      yIdx += 1;
    }
    return xIdx / 2;
  };

  render() {
    return (
            <div className={styles.container}>
                <canvas ref={this.canvasBgRef}
                        width={1920}
                        height={1080}
                        className={`${styles.canvas} ${styles.background}`}/>
                <canvas ref={this.canvasRef}
                        width={1920}
                        height={1080}
                        className={styles.canvas}>
                </canvas>
            </div>
    );
  }
}

export default Ladder;
