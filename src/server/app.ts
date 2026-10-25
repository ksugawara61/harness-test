import { createYoga } from "graphql-yoga";
import { Hono } from "hono";
import { GRAPHQL_PATH } from "@/graphql/client.ts";
import { schema } from "./graphql/schema.ts";

const yoga = createYoga({
  // Expo のサーバーは、グローバルの Response で作った値しか API Route の戻り値として受け付けない。
  // Yoga が同梱の fetch の実装で Response を作らないよう、グローバルのものを渡す
  fetchAPI: { Request, Response },
  graphiql: process.env.NODE_ENV !== "production",
  graphqlEndpoint: GRAPHQL_PATH,
  schema,
});

// API はすべてこの Hono のアプリで受ける。パスは basePath("/api") からの相対で書く
export const app = new Hono()
  .basePath("/api")
  .on(["GET", "POST"], "/graphql", (c) => yoga.fetch(c.req.raw))
  .get("/health", (c) => c.json({ ok: true }));
