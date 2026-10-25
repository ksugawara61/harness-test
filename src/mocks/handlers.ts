import { type HttpHandler, http, HttpResponse } from "msw";
import {
  type CreateTodoInput,
  type Todo,
  TODOS_PATH,
  type UpdateTodoInput,
} from "@/api/todo.ts";

type TodoParams = { id: string };

const resetters = new Set<() => void>();

// createTodoHandlers で作ったすべてのストアを初期データに戻す。
// mocks.ts のハンドラーはテストの間で共有されるため、テストごとに呼ぶ
export const resetTodoStores = () => {
  for (const reset of resetters) reset();
};

// 開発サーバーとテストの両方で使う、メモリ上に TODO を持つ API。
// 呼び出すたびに別のストアを作るため、ケースごとに初期データを分けられる
export const createTodoHandlers = (
  initialTodos: Todo[] = [],
): HttpHandler[] => {
  const todos = new Map<string, Todo>();
  const reset = () => {
    todos.clear();
    for (const todo of initialTodos) todos.set(todo.id, todo);
  };
  reset();
  resetters.add(reset);

  return [
    http.get(TODOS_PATH, () => HttpResponse.json([...todos.values()])),
    http.post<never, CreateTodoInput>(TODOS_PATH, async ({ request }) => {
      const { title } = await request.json();
      const todo: Todo = { completed: false, id: crypto.randomUUID(), title };
      todos.set(todo.id, todo);
      return HttpResponse.json(todo, { status: 201 });
    }),
    http.patch<TodoParams, Omit<UpdateTodoInput, "id">>(
      `${TODOS_PATH}/:id`,
      async ({ params, request }) => {
        const todo = todos.get(params.id);
        if (todo == null) return new HttpResponse(null, { status: 404 });
        const updated = { ...todo, ...(await request.json()) };
        todos.set(updated.id, updated);
        return HttpResponse.json(updated);
      },
    ),
    http.delete<TodoParams>(`${TODOS_PATH}/:id`, ({ params }) => {
      if (!todos.delete(params.id)) {
        return new HttpResponse(null, { status: 404 });
      }
      return new HttpResponse(null, { status: 204 });
    }),
  ];
};
