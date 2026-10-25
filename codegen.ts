import type { CodegenConfig } from "@graphql-codegen/cli";

// モックのリゾルバ（src/mocks/schema.ts）の型を src/graphql/schema.graphql から生成する
const config: CodegenConfig = {
  generates: {
    "src/graphql/resolvers.generated.ts": {
      config: { useTypeImports: true },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
  schema: "src/graphql/schema.graphql",
  silent: true,
};

export default config;
