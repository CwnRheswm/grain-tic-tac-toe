import React, { useContext } from 'react';
import { GridContext, IGridContext } from '../game';

type TSelectPiece = {
    value: string;
    setValue: (value: string) =>  void;
}

export const SelectPiece = (props: TSelectPiece) => {
    const gridContext = useContext<IGridContext>(GridContext)

    return (
        <select value={props.value} onChange={(event) => props.setValue(event?.target.value)}>
            <option style={{display: 'none'}} disabled value={""}>--</option>
            <option disabled={gridContext?.selectedTokens?.includes("❌")} value="❌">❌</option>
            <option disabled={gridContext?.selectedTokens?.includes("⭕")} value="⭕">⭕</option>
            <option disabled={gridContext?.selectedTokens?.includes("🍊")} value="🍊">🍊</option>
            <option disabled={gridContext?.selectedTokens?.includes("🍋")} value="🍋">🍋</option>
            <option disabled={gridContext?.selectedTokens?.includes("🐞")} value="🐞">🐞</option>
            <option disabled={gridContext?.selectedTokens?.includes("🐝")} value="🐝">🐝</option>
            <option disabled={gridContext?.selectedTokens?.includes("🐺")} value="🐺">🐺</option>
            <option disabled={gridContext?.selectedTokens?.includes("👑")} value="👑">👑</option>
            <option disabled={gridContext?.selectedTokens?.includes("👴")} value="👴">👴</option>
            <option disabled={gridContext?.selectedTokens?.includes("💀")} value="💀">💀</option>
        </select>
    )
}