import { graphql } from "@/graphql/client.ts";

// 結果は使わず一覧を取り直すため、id だけを返させる
export const UpdateTodoMutation = graphql(`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      id
    }
  }
`);
