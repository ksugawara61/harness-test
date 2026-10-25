import type { RequestHandler } from "msw";
import { TodoAddMocks } from "./features/todo-add/mocks.ts";
import { TodoListMocks } from "./features/todo-list/mocks.ts";

export const TodoPageMocks = {
  /** 空の一覧から始まり、追加すると未完了の「牛乳を買う」が加わる */
  Added: [...TodoListMocks.EmptyThenAdded, ...TodoAddMocks.Success],
  /** 未完了の「牛乳を買う」1 件から始まり、完了にすると完了済みになる */
  Completed: TodoListMocks.SingleThenCompleted,
  /** 未完了の「牛乳を買う」1 件から始まり、削除すると空になる */
  Deleted: TodoListMocks.SingleThenDeleted,
  /** 空の一覧を表示する */
  Empty: TodoListMocks.Empty,
  /** 未完了の「牛乳を買う」1 件を表示する */
  Success: TodoListMocks.Single,
} satisfies Record<string, RequestHandler[]>;
