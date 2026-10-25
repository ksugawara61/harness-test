import type { RequestHandler } from "msw";
import {
  createMockQuery,
  mockDataResolver,
  mockErrorResolver,
  mockLoadingResolver,
} from "@/mocks/graphql.ts";
import {
  TodoItemFragmentMocks,
  TodoItemMocks,
  UnmaskedTodoItemFragmentMocks,
} from "./features/todo-item/mocks.ts";
import { TodosQuery } from "./graphqls/todos-query.ts";

const activeTodo = {
  ...UnmaskedTodoItemFragmentMocks.Active,
  ...TodoItemFragmentMocks.Active,
};
const completedTodo = {
  ...UnmaskedTodoItemFragmentMocks.Completed,
  ...TodoItemFragmentMocks.Completed,
};

// 最初の 1 回だけ応答する。後ろに並べたハンドラーが、取り直したあとの一覧を返す
const once = { once: true };

export const TodoListMocks = {
  /** 空の一覧を返す */
  Empty: [createMockQuery(TodosQuery, mockDataResolver({ todos: [] }))],
  /** 空の一覧を返し、取り直すと未完了の「牛乳を買う」を返す */
  EmptyThenAdded: [
    createMockQuery(TodosQuery, mockDataResolver({ todos: [] }), once),
    createMockQuery(TodosQuery, mockDataResolver({ todos: [activeTodo] })),
  ],
  /** 一覧の読み込みに失敗する */
  Error: [
    createMockQuery(TodosQuery, mockErrorResolver("読み込みに失敗しました")),
  ],
  /** 一覧を返さず、読み込み中のままにする */
  Loading: [createMockQuery(TodosQuery, mockLoadingResolver)],
  /** 未完了の「牛乳を買う」1 件を返す */
  Single: [
    createMockQuery(TodosQuery, mockDataResolver({ todos: [activeTodo] })),
  ],
  /** 未完了の「牛乳を買う」1 件を返し、完了にすると完了済みで返す */
  SingleThenCompleted: [
    createMockQuery(
      TodosQuery,
      mockDataResolver({ todos: [activeTodo] }),
      once,
    ),
    ...TodoItemMocks.Success,
    createMockQuery(
      TodosQuery,
      mockDataResolver({ todos: [{ ...activeTodo, completed: true }] }),
    ),
  ],
  /** 未完了の「牛乳を買う」1 件を返し、削除すると空の一覧を返す */
  SingleThenDeleted: [
    createMockQuery(
      TodosQuery,
      mockDataResolver({ todos: [activeTodo] }),
      once,
    ),
    ...TodoItemMocks.Success,
    createMockQuery(TodosQuery, mockDataResolver({ todos: [] })),
  ],
  /** 未完了の「牛乳を買う」と完了済みの「ゴミを出す」を返す */
  Success: [
    createMockQuery(
      TodosQuery,
      mockDataResolver({ todos: [activeTodo, completedTodo] }),
    ),
  ],
} satisfies Record<string, RequestHandler[]>;
