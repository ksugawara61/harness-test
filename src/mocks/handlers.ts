import { graphql as execute } from "graphql";
import { HttpResponse, type RequestHandler } from "msw";
import { graphql } from "msw/graphql";
import { GRAPHQL_PATH } from "@/graphql/client.ts";
import type { Todo } from "@/server/graphql/resolvers.generated.ts";
import { mockSchema } from "./schema.ts";

// アプリの GraphQL API（オリジンは問わない）。mocks.ts のハンドラーもここから作る
export const graphqlApi = graphql.link(`*${GRAPHQL_PATH}`);

const resetters = new Set<() => void>();

// createTodoHandlers で作ったすべてのストアを初期データに戻す。
// mocks.ts のハンドラーはテストの間で共有されるため、テストごとに呼ぶ
export const resetTodoStores = () => {
  for (const reset of resetters) reset();
};

// 開発サーバー・テスト・story で使う、メモリ上に TODO を持つ GraphQL API。
// すべての操作を mockSchema で実行する。
// 呼び出すたびに別のストアを作るため、ケースごとに初期データを分けられる
export const createTodoHandlers = (
  initialTodos: Todo[] = [],
): RequestHandler[] => {
  const todos = new Map<string, Todo>();
  const reset = () => {
    todos.clear();
    for (const todo of initialTodos) todos.set(todo.id, todo);
  };
  reset();
  resetters.add(reset);

  return [
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
};

// EXPO_PUBLIC_API_MOCK=offline のとき、src/lib/api.ts の apiFetch が使う
export const handlers = createTodoHandlers();
