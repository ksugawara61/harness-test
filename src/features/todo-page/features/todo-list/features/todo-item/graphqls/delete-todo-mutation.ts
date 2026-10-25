import { graphql } from "@/graphql/client.ts";

export const DeleteTodoMutation = graphql(`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`);
