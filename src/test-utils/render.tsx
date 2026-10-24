import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactElement } from "react";

// 失敗系の検証で再試行を待たないよう、テストごとに retry を切った QueryClient を作る
export const renderFeature = (ui: ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  const user = userEvent.setup();
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
  return { user };
};
