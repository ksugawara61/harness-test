import type { RequestHandler } from "msw";
import {
  createMockMutation,
  mockDataResolver,
  mockErrorResolver,
} from "@/mocks/graphql.ts";
import { CreateTodoMutation } from "./graphqls/create-todo-mutation.ts";

export const TodoAddMocks = {
  Error: [
    createMockMutation(
      CreateTodoMutation,
      mockErrorResolver("作成に失敗しました"),
    ),
  ],
  Success: [
    createMockMutation(
      CreateTodoMutation,
      mockDataResolver({ createTodo: { id: "todo-1" } }),
    ),
  ],
} satisfies Record<string, RequestHandler[]>;
