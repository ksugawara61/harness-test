import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import "@/index.css";
import { queryClient } from "@/query-client.ts";

// 画面に共通のレイアウトは持たないため、子のルートをそのまま描画する
const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <Slot />
  </QueryClientProvider>
);

export default RootLayout;
