import { Board, Column, TypedColumns } from '@/typing';
import { getTodosGroupedByColum } from '@/utils/getTodosGroupedByColumn';
import { create } from 'zustand';

interface BoardState {
    board: Board;
    getBoard:() => void
}
export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypedColumns, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColum();
        set({ board });
    }
}))