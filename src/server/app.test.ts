// @vitest-environment node
import { print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  CreateTodoMutation,
  TodosQuery,
  UpdateTodoMutation,
} from "@/api/todo.ts";
import { GRAPHQL_PATH } from "@/graphql/client.ts";
import { app } from "./app.ts";

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
    const created = await post(print(CreateTodoMutation), {
      input: { title: "牛乳を買う" },
    });
    const { body } = await post(print(TodosQuery), {});

    expect(created.status).toBe(200);
    expect(body.data.todos).toContainEqual(created.body.data.createTodo);
  });

  it("無いやることを更新すると NOT_FOUND を返す", async () => {
    const { body } = await post(print(UpdateTodoMutation), {
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
