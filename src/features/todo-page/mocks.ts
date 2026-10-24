import type { HttpHandler } from "msw";
import { createTodoHandlers } from "../../mocks/handlers.ts";
import { buildTodo } from "../../test-utils/factories.ts";

export const TodoPageMocks = {
  /** 空の一覧から始まる */
  Empty: createTodoHandlers(),
  /** 未完了の「牛乳を買う」1 件から始まる */
  Success: createTodoHandlers([buildTodo({ title: "牛乳を買う" })]),
} satisfies Record<string, HttpHandler[]>;
