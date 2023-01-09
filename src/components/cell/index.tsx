import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { GridContext } from '../game';

const StyledCell = styled.button`
    background-color: #fff;
    border: 1px solid black;
    cursor: pointer;
    height: 60px;
    width: 60px;
    position: relative;

    &:disabled {
      background-color: #fff;
      color: inherit;
      cursor: not-allowed;
    }
`;

const StyledStack = styled.div<{stack: number}>`
    position: absolute;
    top: 0px;
    left: ${props => css`${10 * props.stack}px`};
    font-size: 8px;
`;

export const Cell = (props: {index: number}) => {
    const gridContext = useContext(GridContext);

    const setStacks = () => {
      const x = Array(gridContext?.gridCells?.[props.index]?.stack).fill(null).map((_, i) => <StyledStack key={i} stack={i}>🔴</StyledStack>);
      return x;
    }

    const disabled = props.index === gridContext?.lastCell || (gridContext?.gridCells?.[props.index]?.stack ?? 0) >= 3 ||
    gridContext?.gridCells?.[props.index]?.player === gridContext?.player;

    return (
      <StyledCell disabled={disabled} onClick={() => gridContext?.setPiece?.(props.index)}>
        <>
          {setStacks()} 
          {gridContext?.playerTokens?.[gridContext?.gridCells?.[props.index]?.player ?? -1]}
        </>
      </StyledCell>
    )
}