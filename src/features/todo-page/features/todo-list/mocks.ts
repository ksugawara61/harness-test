import type { RequestHandler } from "msw";
import {
  createMockQuery,
  mockErrorResolver,
  mockLoadingResolver,
} from "@/mocks/graphql.ts";
import { createTodoHandlers } from "@/mocks/handlers.ts";
import { buildTodo } from "@/test-utils/factories.ts";
import { TodosQuery } from "./graphqls/todos-query.ts";

export const TodoListMocks = {
  /** 空の一覧を返す */
  Empty: createTodoHandlers(),
  /** 一覧の読み込みに失敗する */
  Error: [
    createMockQuery(TodosQuery, mockErrorResolver("読み込みに失敗しました")),
  ],
  /** 一覧を返さず、読み込み中のままにする */
  Loading: [createMockQuery(TodosQuery, mockLoadingResolver)],
  /** 未完了の「牛乳を買う」と完了済みの「ゴミを出す」を返す */
  Success: createTodoHandlers([
    buildTodo({ title: "牛乳を買う" }),
    buildTodo({ completed: true, title: "ゴミを出す" }),
  ]),
} satisfies Record<string, RequestHandler[]>;
