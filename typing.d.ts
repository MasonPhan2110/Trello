import { FieldValue } from "firebase/firestore"

interface Board {
    columns: Map<TypeColumns, Column>
}

type TypedColumns = "todo" | "inprogress" | "done"

interface Column {
    id: TypeColumns,
    todos: Todo[]
}
interface Todo {
    id: string,
    createdAt: number,
    updateAt: number,
    title: string,
    status: string,
    image?: Image
}
interface Image {
    name: string,
}