import type { Decorator, Preview } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import type { HttpHandler } from "msw";
import { network } from "virtual:msw";
import "../src/index.css";
import { resetTodoStores } from "../src/mocks/handlers.ts";
import { createTestQueryClient } from "../src/test-utils/query-client.ts";

type MswParameters = { handlers?: HttpHandler[] } | undefined;

// story ごとに QueryClient を作り直し、ほかの story のキャッシュを持ち込まない
const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={createTestQueryClient()}>
    <Story />
  </QueryClientProvider>
);

const preview: Preview = {
  beforeAll: async () => {
    await network.enable();
  },
  decorators: [withQueryClient],
  // story の parameters.msw.handlers に mocks.ts のケースを渡すと、その API に差し替える。
  // メモリ上のストアは story の間で共有されるため、毎回初期データに戻す
  loaders: [
    ({ parameters }) => {
      const msw = parameters.msw as MswParameters;
      resetTodoStores();
      network.resetHandlers(...(msw?.handlers ?? []));
    },
  ],
};

export default preview;
