import type { TadaDocumentNode } from "gql.tada";
import { type GraphQLFormattedError, print } from "graphql";
import { GRAPHQL_PATH } from "@/graphql/client.ts";
import { apiFetch } from "./api.ts";

type GraphQLResponse<Result> = {
  data?: Result | null;
  errors?: GraphQLFormattedError[];
};

class GraphQLRequestError extends Error {
  readonly errors: readonly GraphQLFormattedError[];

  constructor(errors: readonly GraphQLFormattedError[]) {
    super(errors.map((error) => error.message).join("\n"));
    this.errors = errors;
  }
}

// gql.tada で型付けしたドキュメントを送り、data を返す。errors があれば例外にする
export const gqlFetch = async <Result, Variables>(
  document: TadaDocumentNode<Result, Variables>,
  variables: Variables,
): Promise<Result> => {
  const response = await apiFetch(GRAPHQL_PATH, {
    body: JSON.stringify({ query: print(document), variables }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`POST ${GRAPHQL_PATH} failed with ${response.status}`);
  }
  const { data, errors = [] } =
    (await response.json()) as GraphQLResponse<Result>;
  if (errors.length > 0 || data == null) throw new GraphQLRequestError(errors);
  return data;
};
