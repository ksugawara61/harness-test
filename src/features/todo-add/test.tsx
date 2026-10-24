import { specIt } from "@ksugawara61/spec/vitest";
import { screen, waitFor } from "@testing-library/react";
import { describe, expect } from "vitest";
import { renderFeature } from "../../test-utils/render.tsx";
import { server } from "../../test-utils/server.ts";
import { TodoAdd } from "./index.tsx";
import { TodoAddMocks } from "./mocks.ts";
import { spec } from "./spec.ts";

const titleField = () => screen.getByRole("textbox", { name: "やること" });
const addButton = () => screen.getByRole("button", { name: "追加" });

describe("TodoAdd", () => {
  specIt(spec, "submit.ok", {
    given: {
      desc: "作成できる API に向けて表示し、タイトルを入力しておく",
      run: async () => {
        server.use(...TodoAddMocks.Success);
        const { user } = renderFeature(<TodoAdd />);
        await user.type(titleField(), "牛乳を買う");
        return { user };
      },
    },
    when: {
      desc: "追加ボタンを押す",
      run: ({ user }) => user.click(addButton()),
    },
    yields: {
      desc: "入力欄が空になる",
      run: async () => {
        await waitFor(() => expect(titleField()).toHaveValue(""));
      },
    },
  });

  specIt(spec, "validation.blank-title", {
    given: {
      desc: "作成できる API に向けて表示する",
      run: () => {
        server.use(...TodoAddMocks.Success);
        return renderFeature(<TodoAdd />);
      },
    },
    when: {
      desc: "空白だけを入力する",
      run: ({ user }) => user.type(titleField(), "   "),
    },
    yields: {
      desc: "追加ボタンが押せない",
      run: () => {
        expect(addButton()).toBeDisabled();
      },
    },
  });

  specIt(spec, "submit.error", {
    given: {
      desc: "作成に失敗する API に向けて表示し、タイトルを入力しておく",
      run: async () => {
        server.use(...TodoAddMocks.Error);
        const { user } = renderFeature(<TodoAdd />);
        await user.type(titleField(), "牛乳を買う");
        return { user };
      },
    },
    when: {
      desc: "追加ボタンを押す",
      run: ({ user }) => user.click(addButton()),
    },
    yields: [
      {
        desc: "エラーを表示する",
        run: async () => {
          expect(await screen.findByRole("alert")).toHaveTextContent(
            "やることを追加できませんでした",
          );
        },
      },
      {
        desc: "入力したタイトルが残る",
        run: () => {
          expect(titleField()).toHaveValue("牛乳を買う");
        },
      },
    ],
  });
});
