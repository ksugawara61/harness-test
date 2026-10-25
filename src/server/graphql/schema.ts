import { addMocksToSchema } from "@graphql-tools/mock";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers.ts";
import { typeDefs } from "./type-defs.generated.ts";

const base = makeExecutableSchema({ resolvers, typeDefs });

// EXPO_PUBLIC_API_MOCK=server のときは、リゾルバの無いフィールドだけ @graphql-tools/mock が型に合う値を返す
export const schema =
  process.env.EXPO_PUBLIC_API_MOCK === "server"
    ? addMocksToSchema({ preserveResolvers: true, schema: base })
    : base;
