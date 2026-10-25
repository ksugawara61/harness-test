import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app.tsx";
import "@/index.css";

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
    <App />
  </StrictMode>,
);
