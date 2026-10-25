import { readFileSync, writeFileSync } from "node:fs";
import {
  minifyIntrospection,
  outputIntrospectionFile,
} from "@gql.tada/internal";
import { buildSchema, introspectionFromSchema } from "graphql";

// src/graphql/schema.graphql から、モックのスキーマが読む SDL の文字列と、gql.tada の型を生成する。
// gql.tada の CLI（gql-tada generate output）は TypeScript の API を使い、TypeScript 7 では動かないため、
// CLI が内部で使う関数を直接呼ぶ
const SCHEMA_PATH = "src/graphql/schema.graphql";

const sdl = readFileSync(SCHEMA_PATH, "utf8");
// 構文・型の誤りはここで例外になる
const schema = buildSchema(sdl);

writeFileSync(
  "src/graphql/type-defs.generated.ts",
  `// ${SCHEMA_PATH} から scripts/codegen.ts が生成する（編集しない）\nexport const typeDefs = ${JSON.stringify(sdl)};\n`,
);

writeFileSync(
  "src/graphql/graphql-env.d.ts",
  outputIntrospectionFile(
    minifyIntrospection(
      introspectionFromSchema(schema, { descriptions: false }),
    ),
    { fileType: ".d.ts", shouldPreprocess: true },
  ),
);
