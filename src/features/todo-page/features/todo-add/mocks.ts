import { type HttpHandler, http, HttpResponse } from "msw";
import { TODOS_PATH } from "../../../../api/todo.ts";
import { createTodoHandlers } from "../../../../mocks/handlers.ts";

export const TodoAddMocks = {
  Error: [http.post(TODOS_PATH, () => new HttpResponse(null, { status: 500 }))],
  Success: createTodoHandlers(),
} satisfies Record<string, HttpHandler[]>;
