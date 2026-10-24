import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { buildTodo } from "../../test-utils/factories.ts";
import { renderFeature } from "../../test-utils/render.tsx";
import { server } from "../../test-utils/server.ts";
import { specIt } from "../../test-utils/spec-it.ts";
import { TodoItem } from "./index.tsx";
import { TodoItemMocks } from "./mocks.ts";
import { spec } from "./spec.ts";

const givenFailingApi = {
  desc: "更新・削除に失敗する API に向けて表示する",
  run: () => {
    server.use(...TodoItemMocks.Error);
    return renderFeature(
      <TodoItem todo={buildTodo({ title: "牛乳を買う" })} />,
    );
  },
};

const yieldsAlert = {
  desc: "エラーを表示する",
  run: async () =>
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "やることを更新できませんでした",
    ),
};

describe("TodoItem", () => {
  specIt(spec, "toggleFailure", {
    given: givenFailingApi,
    when: {
      desc: "チェックボックスを押す",
      run: ({ user }) =>
        user.click(screen.getByRole("checkbox", { name: "牛乳を買う" })),
    },
    yields: yieldsAlert,
  });

  specIt(spec, "deleteFailure", {
    given: givenFailingApi,
    when: {
      desc: "削除ボタンを押す",
      run: ({ user }) =>
        user.click(
          screen.getByRole("button", { name: "「牛乳を買う」を削除" }),
        ),
    },
    yields: yieldsAlert,
  });
});
