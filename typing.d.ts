import { FieldValue } from "firebase/firestore"

interface Board {
    columns: Map<TypeColumns, Column>
}

type TypeColumns = "todo" | "inprogress" | "done"

interface Column {
    id: TypeColumns,
    todos: Todo[]
}
interface Todo {
    createdAt: number,
    updateAt: number,
    title: string,
    status: string,
    image?: Image
}
interface Image {
    name: string,
}