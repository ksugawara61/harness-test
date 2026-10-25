import { defineSpec } from "@ksugawara61/spec";

export const spec = defineSpec("todo-item", {
  "delete.error": {
    given: "更新・削除に失敗する API に向けて表示する",
    when: "削除ボタンを押す",
    yields: "エラーを表示する",
  },
  "toggle.error": {
    given: "更新・削除に失敗する API に向けて表示する",
    when: "チェックボックスを押す",
    yields: "エラーを表示する",
  },
});
