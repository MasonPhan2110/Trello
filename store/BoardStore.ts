import { db } from '@/firebase/clientApp';
import { Board, Column, Todo, TypedColumns } from '@/typing';
import { getTodosGroupedByColum } from '@/utils/getTodosGroupedByColumn';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';

interface BoardState {
    board: Board;
    getBoard:() => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumns) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
}
export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypedColumns, Column>()
    },
    searchString:"",
    setSearchString: (searchString) => set({ searchString }),
    getBoard: async () => {
        const board = await getTodosGroupedByColum();
        set({ board });
    },
    setBoardState: (board) => set({ board }),
    updateTodoInDB: async (todo, columnId) => {
        const todoRef = doc(db, "todos", todo.id);
        await updateDoc(todoRef,{
            updatedAt: serverTimestamp(),
            status: columnId
        });
    },
}))