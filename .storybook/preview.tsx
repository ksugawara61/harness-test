import type { Decorator, Preview } from "@storybook/react-native-web-vite";
import { QueryClientProvider } from "@tanstack/react-query";
import type { RequestHandler } from "msw";
import { network } from "virtual:msw";
import "@/index.css";
import { createTestQueryClient } from "@/test-utils/query-client.ts";

type MswParameters = { handlers?: RequestHandler[] } | undefined;

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
  // story の parameters.msw.handlers に mocks.ts のケースを渡すと、その API に差し替える
  loaders: [
    ({ parameters }) => {
      const msw = parameters.msw as MswParameters;
      network.resetHandlers(...(msw?.handlers ?? []));
    },
  ],
};

export default preview;
