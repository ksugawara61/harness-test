import { HttpResponse, type RequestHandler } from "msw";
import { createTodoHandlers, graphqlApi } from "@/mocks/handlers.ts";
import { CreateTodoMutation } from "./graphqls/create-todo-mutation.ts";

export const TodoAddMocks = {
  Error: [
    graphqlApi.mutation(CreateTodoMutation, () =>
      HttpResponse.json({ errors: [{ message: "作成に失敗しました" }] }),
    ),
  ],
  Success: createTodoHandlers(),
} satisfies Record<string, RequestHandler[]>;
