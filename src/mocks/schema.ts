import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLError } from "graphql";
import type { Resolvers, Todo } from "@/server/graphql/resolvers.generated.ts";
import { typeDefs } from "@/server/graphql/type-defs.generated.ts";

type MockContext = {
  todos: Map<string, Todo>;
};

const notFound = (id: string) =>
  new GraphQLError(`やること ${id} が見つかりません`, {
    extensions: { code: "NOT_FOUND" },
  });

// メモリ上のストア（context.todos）を読み書きするリゾルバ
const resolvers: Resolvers<MockContext> = {
  Mutation: {
    createTodo: (_parent, { input }, { todos }) => {
      const todo = {
        completed: false,
        id: crypto.randomUUID(),
        title: input.title,
      };
      todos.set(todo.id, todo);
      return todo;
    },
    deleteTodo: (_parent, { id }, { todos }) => {
      if (!todos.delete(id)) throw notFound(id);
      return id;
    },
    updateTodo: (_parent, { input: { id, ...input } }, { todos }) => {
      const todo = todos.get(id);
      if (todo == null) throw notFound(id);
      const updated = { ...todo, ...input };
      todos.set(id, updated);
      return updated;
    },
  },
  Query: {
    todos: (_parent, _args, { todos }) => [...todos.values()],
  },
};

// schema.graphql に足したフィールドは、リゾルバを書くまで @graphql-tools/mock が型に合う値を返す
export const mockSchema = addMocksToSchema({
  preserveResolvers: true,
  schema: makeExecutableSchema({ resolvers, typeDefs }),
});
