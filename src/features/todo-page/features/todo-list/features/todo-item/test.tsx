import { specIt } from "@ksugawara61/spec/vitest";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { renderFeature } from "@/test-utils/render.tsx";
import { server } from "@/test-utils/server.ts";
import { TodoItem } from "./index.tsx";
import { TodoItemFragmentMocks, TodoItemMocks } from "./mocks.ts";
import { spec } from "./spec.ts";

const renderWithFailingApi = () => {
  server.use(...TodoItemMocks.Error);
  return renderFeature(<TodoItem maskedTodo={TodoItemFragmentMocks.Active} />);
};

const expectAlert = async () => {
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "やることを更新できませんでした",
  );
};

describe("TodoItem", () => {
  specIt(spec, "toggle.error", {
    given: {
      desc: "更新・削除に失敗する API に向けて表示する",
      run: renderWithFailingApi,
    },
    when: {
      desc: "チェックボックスを押す",
      run: ({ user }) =>
        user.click(screen.getByRole("checkbox", { name: "牛乳を買う" })),
    },
    yields: { desc: "エラーを表示する", run: expectAlert },
  });

  specIt(spec, "delete.error", {
    given: {
      desc: "更新・削除に失敗する API に向けて表示する",
      run: renderWithFailingApi,
    },
    when: {
      desc: "削除ボタンを押す",
      run: ({ user }) =>
        user.click(
          screen.getByRole("button", { name: "「牛乳を買う」を削除" }),
        ),
    },
    yields: { desc: "エラーを表示する", run: expectAlert },
  });
});
