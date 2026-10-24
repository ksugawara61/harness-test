import { defineSpec } from "@ksugawara61/spec";

export const spec = defineSpec("todo-add", {
  "submit.error": {
    given: "作成に失敗する API に向けて表示し、タイトルを入力しておく",
    when: "追加ボタンを押す",
    yields: ["エラーを表示する", "入力したタイトルが残る"],
  },
  "submit.ok": {
    given: "作成できる API に向けて表示し、タイトルを入力しておく",
    when: "追加ボタンを押す",
    yields: "入力欄が空になる",
  },
  "validation.blank-title": {
    given: "作成できる API に向けて表示する",
    when: "空白だけを入力する",
    yields: "追加ボタンが押せない",
  },
});
