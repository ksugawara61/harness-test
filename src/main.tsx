import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { queryClient } from "@/query-client.ts";
import { routeTree } from "@/route-tree.gen.ts";

const router = createRouter({ routeTree });

// ルーターの型を登録し、Link や useNavigate の to をルートの木から補完させる。
// 宣言のマージには interface が要る
declare module "@tanstack/react-router" {
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

// バックエンドを持たないため、開発サーバーでは MSW のメモリ上の API に向ける
const enableMocking = async () => {
  if (!import.meta.env.DEV) return;
  const { network } = await import("virtual:msw");
  const { createTodoHandlers } = await import("@/mocks/handlers.ts");
  network.configure({ handlers: createTodoHandlers() });
  await network.enable();
};

const container = document.querySelector("#root");
if (container == null) throw new Error("#root が見つかりません");

await enableMocking();

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
