import {
  composeStories,
  type Meta,
  setProjectAnnotations,
  type StoryObj,
} from "@storybook/react-vite";
import type { HttpHandler } from "msw";
import { beforeAll, describe, it, vi } from "vitest";
import preview from "../.storybook/preview.tsx";

type StoryFile = { default: Meta } & Record<string, StoryObj>;

// preview は virtual:msw でブラウザの MSW を動かす。テストでは msw/node の server に向ける
vi.mock("virtual:msw", async () => {
  const { server } = await import("@/test-utils/server.ts");
  return {
    network: {
      enable: () => undefined,
      resetHandlers: (...handlers: HttpHandler[]) => {
        server.resetHandlers(...handlers);
      },
    },
  };
});

const annotations = setProjectAnnotations([preview]);

beforeAll(annotations.beforeAll);

const storyFiles = import.meta.glob<StoryFile>("./**/stories.tsx", {
  eager: true,
});

// すべての stories.tsx の story を描画し、play まで通ることを確かめる。
// story が壊れたまま放置されないよう、Storybook を開かなくても CI で落とす
describe.each(Object.entries(storyFiles))("%s", (_path, storyFile) => {
  it.each(Object.entries(composeStories(storyFile)))(
    "%s を描画できる",
    async (_name, Story) => {
      await Story.run();
    },
  );
});
