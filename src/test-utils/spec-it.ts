import { it } from "vitest";

type Step<Context> = {
  desc: string;
  run: (context: Context) => unknown;
};

type Phases<Context> = {
  given: {
    desc: string;
    run: () => Context | Promise<Context>;
  };
  when: Step<Context>;
  yields: Step<Context> | Step<Context>[];
};

/**
 * 仕様（spec）の 1 項目を given / when / yields の 3 フェーズで検証する。
 * given の戻り値（userEvent など）を when・yields に渡す
 */
export const specIt = <Key extends string, Context>(
  spec: Record<Key, string>,
  key: Key,
  { given, when, yields }: Phases<Context>,
) => {
  const steps = Array.isArray(yields) ? yields : [yields];
  it(spec[key], async () => {
    const context = await given.run();
    await when.run(context);
    for (const step of steps) {
      await step.run(context);
    }
  });
};
