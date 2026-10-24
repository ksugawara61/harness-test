import { type HttpHandler, http, HttpResponse } from "msw";
import { TODOS_PATH } from "../../api/todo.ts";

const failure = () => new HttpResponse(null, { status: 500 });

export const TodoItemMocks = {
  Error: [
    http.patch(`${TODOS_PATH}/:id`, failure),
    http.delete(`${TODOS_PATH}/:id`, failure),
  ],
} satisfies Record<string, HttpHandler[]>;
