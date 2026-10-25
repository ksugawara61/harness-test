import { HttpResponse, type RequestHandler } from "msw";
import { DeleteTodoMutation, UpdateTodoMutation } from "@/api/todo.ts";
import { graphqlApi } from "@/mocks/handlers.ts";

const errors = [{ message: "更新に失敗しました" }];

export const TodoItemMocks = {
  Error: [
    graphqlApi.mutation(UpdateTodoMutation, () =>
      HttpResponse.json({ errors }),
    ),
    graphqlApi.mutation(DeleteTodoMutation, () =>
      HttpResponse.json({ errors }),
    ),
  ],
} satisfies Record<string, RequestHandler[]>;
