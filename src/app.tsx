import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
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

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
