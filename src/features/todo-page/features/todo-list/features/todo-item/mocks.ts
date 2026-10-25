import type { RequestHandler } from "msw";
import {
  type FragmentOf,
  maskFragments,
  type ResultOf,
} from "@/graphql/client.ts";
import {
  createMockMutation,
  mockDataResolver,
  mockErrorResolver,
} from "@/mocks/graphql.ts";
import { buildTodo } from "@/test-utils/factories.ts";
import { DeleteTodoMutation } from "./graphqls/delete-todo-mutation.ts";
import { TodoItemFragment } from "./graphqls/todo-item-fragment.ts";
import { UpdateTodoMutation } from "./graphqls/update-todo-mutation.ts";

const errorResolver = mockErrorResolver("更新に失敗しました");

export const TodoItemMocks = {
  Error: [
    createMockMutation(UpdateTodoMutation, errorResolver),
    createMockMutation(DeleteTodoMutation, errorResolver),
  ],
  /** 更新・削除に成功する */
  Success: [
    createMockMutation(
      UpdateTodoMutation,
      mockDataResolver({ updateTodo: { id: "todo-1" } }),
    ),
    createMockMutation(
      DeleteTodoMutation,
      mockDataResolver({ deleteTodo: "todo-1" }),
    ),
  ],
} satisfies Record<string, RequestHandler[]>;

// masked にする前の 1 件。親の一覧のクエリのモックで、masked の値と重ねて使う
export const UnmaskedTodoItemFragmentMocks = {
  /** 未完了の「牛乳を買う」 */
  Active: buildTodo({ id: "todo-1", title: "牛乳を買う" }),
  /** 完了済みの「ゴミを出す」 */
  Completed: buildTodo({ completed: true, id: "todo-2", title: "ゴミを出す" }),
} satisfies Record<string, ResultOf<typeof TodoItemFragment>>;

// 親の一覧のクエリから受け取る 1 件（masked）。テストと story で Props に渡す
export const TodoItemFragmentMocks = {
  /** 未完了の「牛乳を買う」 */
  Active: maskFragments(
    [TodoItemFragment],
    UnmaskedTodoItemFragmentMocks.Active,
  ),
  /** 完了済みの「ゴミを出す」 */
  Completed: maskFragments(
    [TodoItemFragment],
    UnmaskedTodoItemFragmentMocks.Completed,
  ),
} satisfies Record<string, FragmentOf<typeof TodoItemFragment>>;
