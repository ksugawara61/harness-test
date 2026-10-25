import { defineSpec } from "@ksugawara61/spec";

export const spec = defineSpec("todo-error", {
  "dismiss.ok": {
    given: "メッセージを渡して表示する",
    when: "閉じるボタンを押す",
    yields: "エラーが消える",
  },
});
