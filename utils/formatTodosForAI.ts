import { Board, Todo, TypedColumns } from "@/typing";

const formatTodosForAI = (board: Board) => {
  const todos = Array.from(board.columns.entries());

  const flatArray = todos.reduce((map, [key, value]) => {
    map[key] = value.todos;
    return map;
  }, {} as { [key in TypedColumns]: Todo[] });
  console.log(flatArray);

  // reduce to key: value(length)

  const flatArrayCounted = Object.entries(flatArray).reduce(
    (map, [key, value]) => {
      map[key as TypedColumns] = value.length;
      return map;
    },
    {} as { [key in TypedColumns]: number }
  );

  return flatArray;
};

export default formatTodosForAI;
