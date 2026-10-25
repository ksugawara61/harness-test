import { QueryClient } from "@tanstack/react-query";

// 失敗系をすぐに表示できるよう、retry を切った QueryClient を作る。
// テストと story で、描画ごとに作り直して使う
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
