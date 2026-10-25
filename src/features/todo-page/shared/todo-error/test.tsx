import { specIt } from "@ksugawara61/spec/vitest";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import { renderFeature } from "@/test-utils/render.tsx";
import { TodoError } from "./index.tsx";
import { spec } from "./spec.ts";

describe("TodoError", () => {
  specIt(spec, "dismiss.ok", {
    given: {
      desc: "メッセージを渡して表示する",
      run: () =>
        renderFeature(<TodoError>やることを追加できませんでした</TodoError>),
    },
    when: {
      desc: "閉じるボタンを押す",
      run: ({ user }) =>
        user.click(screen.getByRole("button", { name: "エラーを閉じる" })),
    },
    yields: {
      desc: "エラーが消える",
      run: () => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      },
    },
  });
});
