import { HttpResponse, type RequestHandler } from "msw";
import { CreateTodoMutation } from "@/api/todo.ts";
import { createTodoHandlers, graphqlApi } from "@/mocks/handlers.ts";

export const TodoAddMocks = {
  Error: [
    graphqlApi.mutation(CreateTodoMutation, () =>
      HttpResponse.json({ errors: [{ message: "作成に失敗しました" }] }),
    ),
  ],
  Success: createTodoHandlers(),
} satisfies Record<string, RequestHandler[]>;
