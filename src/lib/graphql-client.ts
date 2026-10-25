import {
  type Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { TadaDocumentNode } from "gql.tada";
import { getOperationAST } from "graphql";
import { gqlFetch } from "./gql.ts";

// GraphQL のクエリの query key の先頭。取り直すときに、ほかのクエリと区別する
const GRAPHQL_QUERY_KEY = "graphql";

// list を返すクエリは、空の配列のとき結果から __typename を拾えない。
// mutation の refetchTypes で取り直したい型は typenames に明示する
type QueryOptions<Variables> = {
  typenames?: readonly string[];
  variables?: Variables;
};

type MutationOptions = {
  // 成功したあとに取り直すクエリの型（__typename）
  refetchTypes?: readonly string[];
};

const getOperationName = <Result, Variables>(
  document: TadaDocumentNode<Result, Variables>,
): string => {
  const name = getOperationAST(document)?.name?.value;
  if (name == null) throw new Error("GraphQL の操作に名前がありません");
  return name;
};

const collectTypenames = (value: unknown, typenames: Set<unknown>): void => {
  if (Array.isArray(value)) {
    for (const item of value) collectTypenames(item, typenames);
    return;
  }
  if (value === null || typeof value !== "object") return;
  for (const [key, field] of Object.entries(value)) {
    if (key === "__typename" && typeof field === "string") typenames.add(field);
    else collectTypenames(field, typenames);
  }
};

// クエリの結果の __typename と、クエリに明示した typenames のどれかが refetchTypes に入っているか
const returnsAnyType = (query: Query, refetchTypes: readonly string[]) => {
  if (query.queryKey[0] !== GRAPHQL_QUERY_KEY) return false;
  const explicit = query.meta?.typenames;
  const typenames = new Set<unknown>(Array.isArray(explicit) ? explicit : []);
  collectTypenames(query.state.data, typenames);
  return refetchTypes.some((type) => typenames.has(type));
};

// gql.tada のクエリを送る。query key は操作の名前と変数から作るため、フィーチャーで key を持たない
export const useGraphQLQuery = <Result, Variables>(
  document: TadaDocumentNode<Result, Variables>,
  options?: QueryOptions<Variables>,
) =>
  useQuery({
    meta: { typenames: options?.typenames },
    queryFn: () => gqlFetch(document, options?.variables),
    queryKey: [
      GRAPHQL_QUERY_KEY,
      getOperationName(document),
      options?.variables,
    ],
  });

// gql.tada の mutation を送る。成功したら refetchTypes の型を返すクエリを取り直す。
// 取り直しが終わるまで isPending のままにし、古い結果のまま次の操作をさせない
export const useGraphQLMutation = <Result, Variables>(
  document: TadaDocumentNode<Result, Variables>,
  options?: MutationOptions,
) => {
  const queryClient = useQueryClient();
  const refetchTypes = options?.refetchTypes ?? [];
  return useMutation({
    mutationFn: (variables: Variables) => gqlFetch(document, variables),
    onSuccess: () =>
      queryClient.invalidateQueries({
        predicate: (query) => returnsAnyType(query, refetchTypes),
      }),
  });
};
