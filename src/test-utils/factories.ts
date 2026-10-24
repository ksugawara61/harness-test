import type { Todo } from "../api/todo.ts";

export const buildTodo = (overrides?: Partial<Todo>): Todo => ({
  completed: false,
  id: crypto.randomUUID(),
  title: "牛乳を買う",
  ...overrides,
});
