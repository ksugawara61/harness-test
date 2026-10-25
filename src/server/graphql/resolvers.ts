import { GraphQLError } from "graphql";
import {
  deleteTodo,
  findTodos,
  insertTodo,
  updateTodo,
} from "@/server/repositories/todo.ts";
import type { Resolvers } from "./resolvers.generated.ts";

const notFound = (id: string) =>
  new GraphQLError(`やること ${id} が見つかりません`, {
    extensions: { code: "NOT_FOUND" },
  });

export const resolvers: Resolvers = {
  Mutation: {
    createTodo: (_parent, { input }) => insertTodo(input.title),
    deleteTodo: async (_parent, { id }) => {
      if (!(await deleteTodo(id))) throw notFound(id);
      return id;
    },
    updateTodo: async (_parent, { input: { id, ...input } }) => {
      const todo = await updateTodo(id, input);
      if (todo == null) throw notFound(id);
      return todo;
    },
  },
  Query: {
    todos: () => findTodos(),
  },
};
