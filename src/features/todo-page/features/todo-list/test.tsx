import { specIt } from "@ksugawara61/spec/vitest";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { renderFeature } from "../../../../test-utils/render.tsx";
import { server } from "../../../../test-utils/server.ts";
import { TodoList } from "./index.tsx";
import { TodoListMocks } from "./mocks.ts";
import { spec } from "./spec.ts";

const renderTodoList = () => renderFeature(<TodoList />);

describe("TodoList", () => {
  specIt(spec, "render.list", {
    given: {
      desc: "未完了 1 件・完了 1 件を返す API に向ける",
      run: () => {
        server.use(...TodoListMocks.Success);
      },
    },
    when: { desc: "表示する", run: renderTodoList },
    yields: [
      {
        desc: "やることが並ぶ",
        run: async () => {
          expect(await screen.findAllByRole("listitem")).toHaveLength(2);
        },
      },
      {
        desc: "完了したやることにはチェックが付く",
        run: () => {
          expect(
            screen.getByRole("checkbox", { name: "ゴミを出す" }),
          ).toBeChecked();
        },
      },
      {
        desc: "未完了の件数を表示する",
        run: () => {
          expect(screen.getByText("残り 1 件")).toBeInTheDocument();
        },
      },
    ],
  });

  specIt(spec, "render.empty", {
    given: {
      desc: "空の一覧を返す API に向ける",
      run: () => {
        server.use(...TodoListMocks.Empty);
      },
    },
    when: { desc: "表示する", run: renderTodoList },
    yields: {
      desc: "やることが無いと表示する",
      run: async () => {
        expect(
          await screen.findByText("やることはありません"),
        ).toBeInTheDocument();
      },
    },
  });

  specIt(spec, "render.error", {
    given: {
      desc: "読み込みに失敗する API に向ける",
      run: () => {
        server.use(...TodoListMocks.Error);
      },
    },
    when: { desc: "表示する", run: renderTodoList },
    yields: {
      desc: "エラーを表示する",
      run: async () => {
        expect(await screen.findByRole("alert")).toHaveTextContent(
          "やることを読み込めませんでした",
        );
      },
    },
  });
});
