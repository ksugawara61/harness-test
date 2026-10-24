import base from "@ksugawara61/code-lint/oxfmtrc.json" with { type: "json" };

export default {
  ...base,
  ignorePatterns: ["pnpm-lock.yaml", "vendor"],
};
