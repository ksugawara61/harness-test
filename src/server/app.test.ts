// @vitest-environment node
import { describe, expect, it } from "vitest";
import { GRAPHQL_PATH } from "@/graphql/client.ts";
import { app } from "./app.ts";

// 操作は使うフィーチャーの graphqls/ に置き、サーバーからは import できないため、ここで書く
const TODOS_QUERY = "query Todos { todos { completed id title } }";
const CREATE_TODO_MUTATION =
  "mutation CreateTodo($input: CreateTodoInput!) { createTodo(input: $input) { completed id title } }";
const UPDATE_TODO_MUTATION =
  "mutation UpdateTodo($input: UpdateTodoInput!) { updateTodo(input: $input) { id } }";

// サーバーを立てずに、Hono のアプリへ HTTP のリクエストを渡して確かめる
const post = async (query: string, variables: Record<string, unknown>) => {
  const response = await app.request(GRAPHQL_PATH, {
    body: JSON.stringify({ query, variables }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  return { body: await response.json(), status: response.status };
};

describe("/api/graphql", () => {
  it("作成したやることを一覧で返す", async () => {
    const created = await post(CREATE_TODO_MUTATION, {
      input: { title: "牛乳を買う" },
    });
    const { body } = await post(TODOS_QUERY, {});

    expect(created.status).toBe(200);
    expect(body.data.todos).toContainEqual(created.body.data.createTodo);
  });

  it("無いやることを更新すると NOT_FOUND を返す", async () => {
    const { body } = await post(UPDATE_TODO_MUTATION, {
      input: { completed: true, id: "missing" },
    });

    expect(body.errors[0].extensions.code).toBe("NOT_FOUND");
  });
});

describe("/api/health", () => {
  it("ok を返す", async () => {
    const response = await app.request("/api/health");

    expect(await response.json()).toEqual({ ok: true });
  });
});
