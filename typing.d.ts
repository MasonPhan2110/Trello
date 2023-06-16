import { FieldValue } from "firebase/firestore"

interface Board {
    columns: Map<TypedColumns, Column>
}

type TypedColumns = "todo" | "inprogress" | "done"

interface Column {
    id: TypedColumns,
    todos: Todo[]
}
interface Todo {
    id: string,
    createdAt: number,
    updateAt: number,
    title: string,
    status: string,
    image?: string
}
