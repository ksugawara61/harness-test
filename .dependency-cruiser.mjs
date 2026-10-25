import { sharedFeatureRules } from "@ksugawara61/code-lint/dependency-cruiser";

/** @type {import("dependency-cruiser").IConfiguration} */
export default {
  forbidden: [
    // 共有フィーチャー（src/features/**/shared/<name>/）は、一番近い親の shared/ から相対パスで import する
    ...sharedFeatureRules(),
    {
      comment:
        "共有フィーチャーどうしも import できるため、循環しないようにする",
      from: {},
      name: "no-circular",
      severity: "error",
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    includeOnly: "^src/",
    parser: "swc",
    tsConfig: { fileName: "tsconfig.json" },
  },
};
