import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetTodoStores } from "@/mocks/handlers.ts";
import { server } from "./server.ts";

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetTodoStores();
});

afterAll(() => {
  server.close();
});
