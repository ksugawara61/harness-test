import { http, HttpResponse } from "msw";
import { type Todo, TODOS_PATH } from "../../api/todo.ts";
import { createTodoHandlers } from "../../mocks/handlers.ts";

export const TodoListMocks = {
  Error: [http.get(TODOS_PATH, () => new HttpResponse(null, { status: 500 }))],
  Success: (todos: Todo[]) => createTodoHandlers(todos),
};
