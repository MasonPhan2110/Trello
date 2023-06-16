import { db, storage } from '@/firebase/clientApp';
import { Board, Column, Todo, TypedColumns } from '@/typing';
import { getTodosGroupedByColum } from '@/utils/getTodosGroupedByColumn';
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from "firebase/storage";
import { create } from 'zustand';

interface BoardState {
    board: Board;
    getBoard:() => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumns) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;

    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumns) => void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
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
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumns) => {
        const newColumns = new Map(get().board.columns);

        // delete todoId from newColumns
        newColumns.get(id)?.todos.splice(taskIndex, 1);
        set({ board: { columns: newColumns } });

        if (todo.image) {
            await deleteObject(ref(storage,todo.image));
        }
        await deleteDoc(doc(db, "todos", todo.id));
    },
    updateTodoInDB: async (todo, columnId) => {
        const todoRef = doc(db, "todos", todo.id);
        await updateDoc(todoRef,{
            updatedAt: serverTimestamp(),
            status: columnId
        });
    },
}))