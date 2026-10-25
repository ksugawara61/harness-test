import { graphql } from "@/graphql/client.ts";

// TodoItem が描画に使うフィールド。一覧のクエリ（todo-list の graphqls/todos-query.ts）が ...TodoItem で取り込む
export const TodoItemFragment = graphql(`
  fragment TodoItem on Todo {
    completed
    id
    title
  }
`);
