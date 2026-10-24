import { defineSpec } from "@ksugawara61/spec";

export const spec = defineSpec("todo-list", {
  "render.empty": {
    given: "空の一覧を返す API に向ける",
    when: "表示する",
    yields: "やることが無いと表示する",
  },
  "render.error": {
    given: "読み込みに失敗する API に向ける",
    when: "表示する",
    yields: "エラーを表示する",
  },
  "render.list": {
    given: "未完了 1 件・完了 1 件を返す API に向ける",
    when: "表示する",
    yields: [
      "やることが並ぶ",
      "完了したやることにはチェックが付く",
      "未完了の件数を表示する",
    ],
  },
});
