import { db, storage } from '@/firebase/clientApp';
import { Board, Column, Todo, TypedColumns } from '@/typing';
import { getTodosGroupedByColum } from '@/utils/getTodosGroupedByColumn';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject, uploadBytes } from "firebase/storage";
import { title } from 'process';
import { create } from 'zustand';

interface BoardState {
    board: Board;
    getBoard:() => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumns) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;

    newTaskType: TypedColumns,

    newTaskInput: string;
    image: File | null;
    setImage: (image: File | null) => void;
    setNewTaskInput: (input: string) => void;

    setNewTaskType: (columnId: TypedColumns) => void;


    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumns) => void;
    addTask: (todo: string, columnId:TypedColumns, image?:File | null) => void;
}
export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumns, Column>()
    },
    searchString:"",
    newTaskInput:"",
    newTaskType: "todo",
    image: null,
    
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
    addTask: async (todo: string, columnId: TypedColumns, image?: File | null) => {
        if (image) {
            const imageRef = ref(storage, image.name);
            await uploadBytes(imageRef, image)
        }
        const docRef = await addDoc(collection(db, "todos"), {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            title: todo,
            status: columnId,
            ...(image && {image: image.name})
          });
          
          console.log('Added document with ID: ', docRef.id);
          set({ newTaskInput: " "})

          set((state)=> {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo = {
                id:docRef.id!,
                createdAt:Date.now(),
                updateAt:Date.now(),
                title: todo,
                status: columnId,
                ...(image && {image: image.name})
            }
            const column = newColumns.get(columnId);

            if(!column) {
                newColumns.set(columnId, {
                    id:columnId,
                    todos:[newTodo]
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }
            return {
                board: {
                    columns: newColumns
                }
            }
          })
    },
    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    setNewTaskType: (columnId: TypedColumns) => set({ newTaskType: columnId }),
    setImage: (image: File | null) => set({ image }),
    updateTodoInDB: async (todo, columnId) => {
        const todoRef = doc(db, "todos", todo.id);
        await updateDoc(todoRef,{
            updatedAt: serverTimestamp(),
            status: columnId
        });
    },
}))