import { queryOptions } from "@tanstack/react-query";
import { graphql, type ResultOf, type VariablesOf } from "@/graphql/client.ts";
import { gqlFetch } from "@/lib/gql.ts";

export const TodosQuery = graphql(`
  query Todos {
    todos {
      completed
      id
      title
    }
  }
`);

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

export type Todo = ResultOf<typeof TodosQuery>["todos"][number];

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

export const todosQueryOptions = queryOptions({
  queryFn: async () => {
    const { todos } = await gqlFetch(TodosQuery, {});
    return todos;
  },
  queryKey: ["todos"],
});
