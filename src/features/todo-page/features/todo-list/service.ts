import { queryOptions, useQuery } from "@tanstack/react-query";
import { todosQueryKey } from "@/api/todo.ts";
import { gqlFetch } from "@/lib/gql.ts";
import { TodosQuery } from "./graphqls/todos-query.ts";

const todosQueryOptions = queryOptions({
  queryFn: async () => {
    const { todos } = await gqlFetch(TodosQuery, {});
    return todos;
  },
  queryKey: todosQueryKey,
});

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
