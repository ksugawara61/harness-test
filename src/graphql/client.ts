import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphql-env.d.ts";

// アプリの GraphQL API のパス。src/lib/gql.ts が送り、src/mocks/handlers.ts のモックが受ける
export const GRAPHQL_PATH = "/api/graphql";

// schema.graphql から生成した graphql-env.d.ts をもとに、クエリの結果と変数を型付けする
export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: { ID: string };
}>();

export { maskFragments, readFragment } from "gql.tada";
export type { FragmentOf } from "gql.tada";
