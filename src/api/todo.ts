import { graphql, type ResultOf, type VariablesOf } from "@/graphql/client.ts";
import { gqlFetch } from "@/lib/gql.ts";

// 一覧のクエリ（todo-list の query.ts）の key。追加・更新・削除のあとに、この key で一覧を取り直す
export const todosQueryKey = ["todos"];

export const CreateTodoMutation = graphql(`
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      completed
      id
      title
    }
  }
`);

export const UpdateTodoMutation = graphql(`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      completed
      id
      title
    }
  }
`);

export const DeleteTodoMutation = graphql(`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`);

type Todo = ResultOf<typeof CreateTodoMutation>["createTodo"];

export type CreateTodoInput = VariablesOf<typeof CreateTodoMutation>["input"];

export type UpdateTodoInput = VariablesOf<typeof UpdateTodoMutation>["input"];

export const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
  const { createTodo: todo } = await gqlFetch(CreateTodoMutation, { input });
  return todo;
};

export const updateTodo = async (input: UpdateTodoInput): Promise<Todo> => {
  const { updateTodo: todo } = await gqlFetch(UpdateTodoMutation, { input });
  return todo;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await gqlFetch(DeleteTodoMutation, { id });
};
