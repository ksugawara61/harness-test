import { useQuery } from "@tanstack/react-query";
import { todosQueryOptions } from "@/api/todo.ts";

export const useService = () => {
  const { data: todos = [], isError, isPending } = useQuery(todosQueryOptions);

  return {
    isEmpty: todos.length === 0,
    isError,
    isPending,
    remainingCount: todos.filter((todo) => !todo.completed).length,
    todos,
  };
};
