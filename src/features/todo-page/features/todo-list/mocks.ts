import { HttpResponse, type RequestHandler } from "msw";
import { TodosQuery } from "@/api/todo.ts";
import { createTodoHandlers, graphqlApi } from "@/mocks/handlers.ts";
import { buildTodo } from "@/test-utils/factories.ts";

export const TodoListMocks = {
  /** 空の一覧を返す */
  Empty: createTodoHandlers(),
  /** 一覧の読み込みに失敗する */
  Error: [
    graphqlApi.query(TodosQuery, () =>
      HttpResponse.json({ errors: [{ message: "読み込みに失敗しました" }] }),
    ),
  ],
  /** 未完了の「牛乳を買う」と完了済みの「ゴミを出す」を返す */
  Success: createTodoHandlers([
    buildTodo({ title: "牛乳を買う" }),
    buildTodo({ completed: true, title: "ゴミを出す" }),
  ]),
} satisfies Record<string, RequestHandler[]>;
