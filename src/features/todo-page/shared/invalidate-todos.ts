import type { QueryClient } from "@tanstack/react-query";
import { todosQueryOptions } from "@/api/todo.ts";

/** やることの一覧を取り直す。追加・完了・削除のあとに呼ぶ */
export const invalidateTodos = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: todosQueryOptions.queryKey });
