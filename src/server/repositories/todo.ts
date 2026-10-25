import type { Todo } from "@/server/graphql/types.ts";

// PoC のため、データはサーバーのプロセスのメモリに持つ（再起動すると消える）。
// DB に移すときは、このファイルの関数の中身だけを差し替える。
// Expo の開発サーバーは API Route のモジュールをリクエストごとに評価し直し、モジュールの変数はリクエストをまたいで残らない。
// そのため、ストアは globalThis に置く
const store = globalThis as typeof globalThis & {
  harnessTestTodos?: Map<string, Todo>;
};
const todos = (store.harnessTestTodos ??= new Map<string, Todo>());

export const findTodos = async (): Promise<Todo[]> => [...todos.values()];

export const insertTodo = async (title: string): Promise<Todo> => {
  const todo = { completed: false, id: crypto.randomUUID(), title };
  todos.set(todo.id, todo);
  return todo;
};

export const updateTodo = async (
  id: string,
  input: Pick<Todo, "completed">,
): Promise<Todo | undefined> => {
  const todo = todos.get(id);
  if (todo == null) return undefined;
  const updated = { ...todo, ...input };
  todos.set(id, updated);
  return updated;
};

export const deleteTodo = async (id: string): Promise<boolean> =>
  todos.delete(id);
