import { HttpResponse, type RequestHandler } from "msw";
import { DeleteTodoMutation, UpdateTodoMutation } from "@/api/todo.ts";
import { type FragmentOf, maskFragments } from "@/graphql/client.ts";
import { graphqlApi } from "@/mocks/handlers.ts";
import { buildTodo } from "@/test-utils/factories.ts";
import { TodoItemFragment } from "./fragment.ts";

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

// 親の一覧のクエリから受け取る 1 件（masked）。テストと story で Props に渡す
export const TodoItemFragmentMocks = {
  /** 未完了の「牛乳を買う」 */
  Active: maskFragments(
    [TodoItemFragment],
    buildTodo({ id: "todo-1", title: "牛乳を買う" }),
  ),
  /** 完了済みの「ゴミを出す」 */
  Completed: maskFragments(
    [TodoItemFragment],
    buildTodo({ completed: true, id: "todo-2", title: "ゴミを出す" }),
  ),
} satisfies Record<string, FragmentOf<typeof TodoItemFragment>>;
