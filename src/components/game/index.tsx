import React, { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Cell } from '../cell';
import { SelectPiece } from '../select-piece';

interface IGrid {
  gridSize: number;
}

type GridCellPiece = {
  player: number;
  stack: number;
}

export interface IGridContext {
  gridCells?: Array<GridCellPiece>;
  lastCell?: number;
  player?: number;
  playerTokens?: Array<string>;
  selectedTokens?: Array<string>;
  setPiece?: (index: number) => void;
}

const StyledGrid = styled.div<IGrid>`
  display: grid;
  gap: 15px;

  ${props => css`
    grid-template-columns: repeat(${props.gridSize}, 1fr);
  `}
`;

export const GridContext = createContext<IGridContext>({});

const defaultGridSize = 3;

export const Game = () => {
  const [gridSize, setGridSize] = useState<number>(defaultGridSize);
  const [gridCells, setGridCells] = useState<Array<GridCellPiece>>([]);
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [playerTokens, setPlayerTokens] = useState<Array<string>>([]);
  const [selectedTokens, setSelectedTokens] = useState<Array<string>>([]);
  const [playing, setPlaying] = useState<boolean>(false);
  const [player, setPlayer] = useState<number>(0);
  const [lastCell, setLastCell] = useState<number | undefined>(undefined);

  const makeGrid = useMemo(() => (
    <StyledGrid gridSize={gridSize}>
      {Array(gridSize * gridSize).fill('').map((_, i) => <Cell key={i} index={i}></Cell>)}
    </StyledGrid>
  ), [gridSize]);

  const setPiece = (index: number) => {
    setGridCells(gridCells.map((c, i) => i !== index ? c : {player: player, stack: c.stack + 1}));
    setPlayer(Math.max(((player + 1) % (numPlayers)), 0));
    setLastCell(index);
  }

  const showPlayerToken = useCallback((index: number) => playerTokens?.[index], [playerTokens]);
  const setPlayerToken = useCallback((index: number) => (newToken: string) => {
    const playersToken = playerTokens[index];
    const usedTokens = [...selectedTokens];
    if (usedTokens.indexOf(playersToken) >= 0) usedTokens.splice(usedTokens.indexOf(playersToken, 1));
    setSelectedTokens([...usedTokens, newToken]);
    setPlayerTokens(playerTokens.map((token, i) => index === i ? newToken : token));
  }, [playerTokens, selectedTokens]);

  const playerTokenSelectors = useMemo(() => (
    Array(numPlayers).fill('').map((_, i) => <SelectPiece key={i} value={showPlayerToken(i)} setValue={setPlayerToken(i)}></SelectPiece>)
  ), [numPlayers, setPlayerToken, showPlayerToken]);

  useEffect(() => {
    setGridSize(numPlayers + 1);
    setPlayerTokens(Array(numPlayers).fill(''));
  }, [numPlayers]);

  useEffect(() => {
    if (playing) setGridCells(Array(gridSize * gridSize).fill({player: null, stack: 0}));
    setPlayer(0);
    if (!playing) {
      setSelectedTokens(Array(numPlayers).fill(''));
      setPlayerTokens(Array(numPlayers).fill(''));
      setLastCell(undefined);
    }
  }, [numPlayers, gridSize, playing]);

  return (
    <GridContext.Provider value={{
      gridCells: gridCells,
      lastCell: lastCell,
      player: player,
      playerTokens: playerTokens,
      selectedTokens: selectedTokens,
      setPiece: playing ? setPiece : () => {},
    }}>
      {!playing && (
        <>
          <div>
            <label htmlFor="gridSize">Grid Size: </label>
            <select id="gridSize" onChange={(event) => setGridSize( Number(event?.target.value) )} value={gridSize}>
              {numPlayers < 3 && <option value="3">3 x 3</option>}
              {numPlayers < 4 && <option value="4">4 x 4</option>}
              {numPlayers < 5 && <option value="5">5 x 5</option>}
              {numPlayers < 6 && <option value="6">6 x 6</option>}
            </select>
          </div>

          <div>
            <label htmlFor="players">Players: </label>
            <select id="players" onChange={(event) => setNumPlayers(Number(event?.target.value))} value={numPlayers}>
              <option value={2}>2 Player</option>
              <option value={3}>3 Player</option>
              <option value={4}>4 Player</option>
              <option value={5}>5 Player</option>
            </select>            
          </div>

          <div>
            {playerTokenSelectors}
          </div>
            
          <div>
            <button disabled={playerTokens.some(token => !token)} onClick={() => setPlaying(true)}>BEGIN!</button>
          </div>
        </>
      )}
      {playing && (
        <>
          <div>Player {player + 1}'s turn</div>
            {makeGrid}
          <button onClick={() => setPlaying(false)}>End Game</button>
        </>
      )}
    </GridContext.Provider>
  )
}