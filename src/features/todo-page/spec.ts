import { defineSpec } from "@ksugawara61/spec";

export const spec = defineSpec("todo-page", {
  "add.listed": {
    given: "空の一覧で表示し、タイトルを入力しておく",
    when: "追加ボタンを押す",
    yields: "一覧に未完了で加わる",
  },
  "complete.count-decreased": {
    given: "未完了のやることが 1 件ある一覧で表示する",
    when: "チェックボックスを押す",
    yields: "未完了の件数が 0 件になる",
  },
  "delete.removed": {
    given: "やることが 1 件ある一覧で表示する",
    when: "削除ボタンを押す",
    yields: "やることが無いと表示する",
  },
});
