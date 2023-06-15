import { db } from '@/firebase/clientApp';
import { Board, Column, TypedColumns } from '@/typing';
import { collection, doc, getDocs } from "firebase/firestore";
export const getTodosGroupedByColum = async() => {   
    const todos = await getDocs(collection(db, "todos"));
    const columns = new Map<TypedColumns, Column>();
    todos.forEach((todo) => {
        if (!columns.get(todo.data().status)) {
            columns.set(todo.data().status,{
                id: todo.data().status,
                todos: []
            })
        }
        columns.get(todo.data().status)!.todos.push({
            id: todo.id,
            createdAt: todo.data().createdAt.seconds,
            updateAt: todo.data().updatedAt.seconds,
            title: todo.data().title,
            status: todo.data().status,
            ...(todo.data().image && {image: todo.data().image})
        })
    });
    const columnTypes: TypedColumns[] = ["todo", "inprogress","done"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType,{
                id: columnType,
                todos:[]
            });
        }
    }
    // sort columns by columnsTypes
    const sortedColums = new Map(
        Array.from(columns.entries()).sort((a,b)=>(
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        ))
    );
    
    const board: Board = {
        columns: sortedColums
    }

    return board;
}