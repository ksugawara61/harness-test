import type { TadaDocumentNode } from "gql.tada";
import { delay, HttpResponse } from "msw";
import {
  type GraphQLQuery,
  type GraphQLResponseBody,
  type GraphQLResponseResolver,
  type GraphQLVariables,
  graphql,
} from "msw/graphql";
import { GRAPHQL_PATH } from "@/graphql/client.ts";

// アプリの GraphQL API（オリジンは問わない）
export const graphqlApi = graphql.link(`*${GRAPHQL_PATH}`);

// gql.tada のクエリに応答するハンドラーを作る。resolver が返す data はクエリの結果の型で検査される
export const createMockQuery = <
  Result extends GraphQLQuery,
  Variables extends GraphQLVariables,
>(
  document: TadaDocumentNode<Result, Variables>,
  resolver: GraphQLResponseResolver<Result, Variables>,
) => graphqlApi.query<Result, Variables>(document, resolver);

// gql.tada の mutation に応答するハンドラーを作る
export const createMockMutation = <
  Result extends GraphQLQuery,
  Variables extends GraphQLVariables,
>(
  document: TadaDocumentNode<Result, Variables>,
  resolver: GraphQLResponseResolver<Result, Variables>,
) => graphqlApi.mutation<Result, Variables>(document, resolver);

// errors を返して、操作を失敗させる。data を持たないため、どの操作の resolver にも渡せる
export const mockErrorResolver = (message: string) => () =>
  HttpResponse.json<GraphQLResponseBody<never>>({ errors: [{ message }] });

// 応答を返さず、読み込み中のままにする
export const mockLoadingResolver = () => delay("infinite");
