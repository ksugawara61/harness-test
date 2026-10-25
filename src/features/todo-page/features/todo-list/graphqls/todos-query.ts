import { graphql } from "@/graphql/client.ts";
import { TodoItemFragment } from "../features/todo-item/graphqls/todo-item-fragment.ts";

// 一覧が自分で使うフィールド（件数の completed と key の id）だけを書き、
// 1 件分の描画に使うフィールドは TodoItem の fragment に任せる
export const TodosQuery = graphql(
  `
    query Todos {
      todos {
        completed
        id
        ...TodoItem
      }
    }
  `,
  [TodoItemFragment],
);
