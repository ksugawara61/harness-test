import { readFileSync, writeFileSync } from "node:fs";
import { buildSchema } from "graphql";

// src/graphql/schema.graphql の SDL を、文字列として export する TS のモジュールにする（サーバーとモックのスキーマが使う）。
// 実行時に .graphql を読み込まない（Metro・Vitest の設定や fs を要らなくする）ため
const SCHEMA_PATH = "src/graphql/schema.graphql";

const sdl = readFileSync(SCHEMA_PATH, "utf8");
// 構文・型の誤りはここで例外になる
buildSchema(sdl);

writeFileSync(
  "src/server/graphql/type-defs.generated.ts",
  `// ${SCHEMA_PATH} から scripts/gen-typedefs.mts が生成する（編集しない）\nexport const typeDefs = ${JSON.stringify(sdl)};\n`,
);
