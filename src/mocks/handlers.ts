import { graphql as execute } from "graphql";
import { HttpResponse, type RequestHandler } from "msw";
import type { Todo } from "@/server/graphql/resolvers.generated.ts";
import { graphqlApi } from "./graphql.ts";
import { mockSchema } from "./schema.ts";

const todos = new Map<string, Todo>();

// EXPO_PUBLIC_API_MOCK=offline のとき、src/lib/api.ts の apiFetch が使う、メモリ上に TODO を持つ GraphQL API。
// すべての操作を mockSchema で実行する。
// テストと story は、mocks.ts で操作ごとに決まった応答を返すハンドラーを使う
export const handlers: RequestHandler[] = [
  graphqlApi.operation(async ({ query, variables }) =>
    HttpResponse.json(
      await execute({
        contextValue: { todos },
        schema: mockSchema,
        source: query,
        variableValues: variables,
      }),
    ),
  ),
];
