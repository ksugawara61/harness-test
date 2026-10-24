import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { buildTodo } from "../../test-utils/factories.ts";
import { renderFeature } from "../../test-utils/render.tsx";
import { server } from "../../test-utils/server.ts";
import { specIt } from "../../test-utils/spec-it.ts";
import { TodoList } from "./index.tsx";
import { TodoListMocks } from "./mocks.ts";
import { spec } from "./spec.ts";

const whenRendered = {
  desc: "表示する",
  run: () => renderFeature(<TodoList />),
};

describe("TodoList", () => {
  specIt(spec, "list", {
    given: {
      desc: "未完了 1 件・完了 1 件を返す API に向ける",
      run: () => {
        server.use(
          ...TodoListMocks.Success([
            buildTodo({ title: "牛乳を買う" }),
            buildTodo({ completed: true, title: "ゴミを出す" }),
          ]),
        );
      },
    },
    when: whenRendered,
    yields: [
      {
        desc: "やることが並ぶ",
        run: async () =>
          expect(await screen.findAllByRole("listitem")).toHaveLength(2),
      },
      {
        desc: "完了したやることにはチェックが付く",
        run: () =>
          expect(
            screen.getByRole("checkbox", { name: "ゴミを出す" }),
          ).toBeChecked(),
      },
      {
        desc: "未完了の件数を表示する",
        run: () => expect(screen.getByText("残り 1 件")).toBeInTheDocument(),
      },
    ],
  });

  specIt(spec, "empty", {
    given: {
      desc: "空の一覧を返す API に向ける",
      run: () => {
        server.use(...TodoListMocks.Success([]));
      },
    },
    when: whenRendered,
    yields: {
      desc: "やることが無いと表示する",
      run: async () =>
        expect(
          await screen.findByText("やることはありません"),
        ).toBeInTheDocument(),
    },
  });

  specIt(spec, "failure", {
    given: {
      desc: "読み込みに失敗する API に向ける",
      run: () => {
        server.use(...TodoListMocks.Error);
      },
    },
    when: whenRendered,
    yields: {
      desc: "エラーを表示する",
      run: async () =>
        expect(await screen.findByRole("alert")).toHaveTextContent(
          "やることを読み込めませんでした",
        ),
    },
  });
});
