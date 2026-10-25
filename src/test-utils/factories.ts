import type { Todo } from "@/server/graphql/types.ts";

// fragment のモックに渡す、サーバーの Todo
export const buildTodo = (overrides?: Partial<Todo>): Todo => ({
  completed: false,
  id: crypto.randomUUID(),
  title: "牛乳を買う",
  ...overrides,
});
