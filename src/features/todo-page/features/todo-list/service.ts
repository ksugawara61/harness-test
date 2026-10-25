import { useGraphQLQuery } from "@/lib/graphql-client.ts";
import { TodosQuery } from "./graphqls/todos-query.ts";

export const useService = () => {
  // 結果に __typename を選ばず、空の一覧からは型を拾えないため、todo-add・todo-item の
  // refetchTypes で取り直せるよう返す型を明示する
  const { data, isError, isPending } = useGraphQLQuery(TodosQuery, {
    typenames: ["Todo"],
  });
  const todos = data?.todos ?? [];

  return {
    isEmpty: todos.length === 0,
    isError,
    isPending,
    remainingCount: todos.filter((todo) => !todo.completed).length,
    todos,
  };
};
