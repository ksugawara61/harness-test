import type { RequestHandler } from "msw";
import { createMockMutation, mockErrorResolver } from "@/mocks/graphql.ts";
import { createTodoHandlers } from "@/mocks/handlers.ts";
import { CreateTodoMutation } from "./graphqls/create-todo-mutation.ts";

export const TodoAddMocks = {
  Error: [
    createMockMutation(
      CreateTodoMutation,
      mockErrorResolver("作成に失敗しました"),
    ),
  ],
  Success: createTodoHandlers(),
} satisfies Record<string, RequestHandler[]>;
