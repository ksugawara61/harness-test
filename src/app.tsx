import { QueryClientProvider } from "@tanstack/react-query";
import { TodoPage } from "./features/todo-page/index.tsx";
import { queryClient } from "./query-client.ts";

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TodoPage />
  </QueryClientProvider>
);
