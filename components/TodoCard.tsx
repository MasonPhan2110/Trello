'use client'
import { useBoardStore } from "@/store/BoardStore";
import { Todo, TypedColumns } from "@/typing"
import getURL from "@/utils/getUrl";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd"


type Props = {
    todo: Todo;
    index: number;
    id: TypedColumns;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}
function TodoCard({todo,index,id,innerRef,draggableProps,dragHandleProps}: Props) {
  const deleteTask = useBoardStore((state)=>state.deleteTask);
  const [imageURL, setImageURL] = useState<string|null>(null);

  useEffect(()=> {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getURL(todo.image!);
        console.log("URL",url);
        if(url) {
          setImageURL(url.toString());
        }
      }
      fetchImage()
    }
  },[todo])
  return (
    <div
    className="bg-white rounded-md space-y-2 drop-shadow-md"
    {...draggableProps} {...dragHandleProps} ref={innerRef}>
        <div className="flex justify-between items-center p-5">
            <p>{todo.title}</p>
            <button onClick={()=>deleteTask(index,todo, id)} className="text-red-500 hover:text-red-600">
                <XCircleIcon
                    className="ml-5 h-8 w-8" />
            </button>
        </div>
        {imageURL && (
          <div className="relative h-full w-full rounded-b-md">
            <Image
              src={imageURL}
              alt="Task Image"
              width={400}
              height={200}
              className="w-full object-contain rounded-b-md"
            />
          </div>
        )}
    </div>
  )
}

export default TodoCard