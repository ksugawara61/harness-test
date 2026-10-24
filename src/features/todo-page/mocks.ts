import type { Todo } from "../../api/todo.ts";
import { createTodoHandlers } from "../../mocks/handlers.ts";

export const TodoPageMocks = {
  Success: (todos: Todo[]) => createTodoHandlers(todos),
};
