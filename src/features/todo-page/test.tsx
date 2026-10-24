import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { buildTodo } from "../../test-utils/factories.ts";
import { renderFeature } from "../../test-utils/render.tsx";
import { server } from "../../test-utils/server.ts";
import { specIt } from "../../test-utils/spec-it.ts";
import { TodoPage } from "./index.tsx";
import { TodoPageMocks } from "./mocks.ts";
import { spec } from "./spec.ts";

// 子のフィーチャーで検証した入力や失敗時の表示は見ず、
// 更新のあとに一覧が取り直されることだけを検証する
describe("TodoPage", () => {
  specIt(spec, "add", {
    given: {
      desc: "空の一覧で表示し、タイトルを入力しておく",
      run: async () => {
        server.use(...TodoPageMocks.Success([]));
        const { user } = renderFeature(<TodoPage />);
        await screen.findByText("やることはありません");
        await user.type(
          screen.getByRole("textbox", { name: "やること" }),
          "牛乳を買う",
        );
        return { user };
      },
    },
    when: {
      desc: "追加ボタンを押す",
      run: ({ user }) =>
        user.click(screen.getByRole("button", { name: "追加" })),
    },
    yields: {
      desc: "一覧に未完了で加わる",
      run: async () =>
        expect(
          await screen.findByRole("checkbox", { name: "牛乳を買う" }),
        ).not.toBeChecked(),
    },
  });

  specIt(spec, "complete", {
    given: {
      desc: "未完了のやることが 1 件ある一覧で表示する",
      run: async () => {
        server.use(
          ...TodoPageMocks.Success([buildTodo({ title: "牛乳を買う" })]),
        );
        const { user } = renderFeature(<TodoPage />);
        await screen.findByText("残り 1 件");
        return { user };
      },
    },
    when: {
      desc: "チェックボックスを押す",
      run: ({ user }) =>
        user.click(screen.getByRole("checkbox", { name: "牛乳を買う" })),
    },
    yields: {
      desc: "未完了の件数が 0 件になる",
      run: async () =>
        expect(await screen.findByText("残り 0 件")).toBeInTheDocument(),
    },
  });

  specIt(spec, "delete", {
    given: {
      desc: "やることが 1 件ある一覧で表示する",
      run: async () => {
        server.use(
          ...TodoPageMocks.Success([buildTodo({ title: "牛乳を買う" })]),
        );
        const { user } = renderFeature(<TodoPage />);
        await screen.findByText("残り 1 件");
        return { user };
      },
    },
    when: {
      desc: "削除ボタンを押す",
      run: ({ user }) =>
        user.click(
          screen.getByRole("button", { name: "「牛乳を買う」を削除" }),
        ),
    },
    yields: {
      desc: "やることが無いと表示する",
      run: async () =>
        expect(
          await screen.findByText("やることはありません"),
        ).toBeInTheDocument(),
    },
  });
});
