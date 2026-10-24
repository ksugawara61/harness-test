# harness-test

[harness](https://github.com/ksugawara61/harness) の `@ksugawara61/code-lint` の規約と `@ksugawara61/spec` の仕様テストに従って書いた、React・Vite・TanStack Query の TODO アプリ。
やることの追加・完了の切り替え・削除と、未完了の件数の表示ができる。

バックエンドは持たない。開発サーバーでは MSW がメモリ上の REST API（`/api/todos`）として応答する。
そのため、リロードするとデータは消える。

## 使い方

```bash
pnpm install
pnpm dev           # 開発サーバー（MSW の API に向く）
pnpm test          # Vitest の仕様テストと、spec.ts の網羅の検査
pnpm lint          # oxlint（型情報を使う検査を含む）と JSON のキー順
pnpm typecheck     # tsc
pnpm format        # oxfmt
pnpm knip          # 未使用の export・依存の検出
pnpm build         # dist/ に出力する
```

## 構成

```text
src/
  api/todo.ts            # REST API の呼び出しと TanStack Query の queryOptions
  mocks/handlers.ts      # メモリ上に TODO を持つ MSW のハンドラー（開発サーバーとテストで共用）
  features/
    todo-page/           # 画面。追加フォームと一覧を並べる
    todo-add/            # 追加フォーム
    todo-list/           # 一覧と未完了の件数
    todo-item/           # 1 件分の完了切り替えと削除
  ui/                    # 見た目だけを持つ部品（Button・TextField・Checkbox・Alert）
  test-utils/            # 描画ヘルパー・MSW のサーバー
```

フィーチャーのディレクトリには、次のファイルを置く。

| ファイル         | 中身                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `index.tsx`      | フィーチャーの入口のコンポーネント。export は 1 つだけ               |
| `use-service.ts` | フックとロジックをまとめた `useService`                              |
| `spec.ts`        | `defineSpec` で宣言した仕様。ケースごとに given・when・yields を書く |
| `mocks.ts`       | テストで使う API のモック                                            |
| `test.tsx`       | `spec.ts` の各項目を `specIt` で確かめる仕様テスト                   |

## 当てている規約

`.oxlintrc.json` で code-lint の `oxlintrc.json` を `extends` し、規約のルールをパスごとに有効にしている。

| 対象                            | ルール                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `src/features/**/*.tsx`         | `only-use-service-hooks`・`no-handler-in-component`・`no-inline-handler-logic` など |
| `src/features/*/index.tsx`      | `no-multiple-feature-exports`                                                       |
| `src/features/*/use-service.ts` | `use-service-handle-only`・`no-raw-setter-return`                                   |
| `src/ui/**/*.tsx`               | `no-style-prop-in-ui`・`no-test-id`                                                 |
| `src/**/test.tsx`               | `no-raw-vitest-test`・`no-expect-in-given-when`・`no-waiting-in-when` など          |
| `src/**`                        | `max-lines`（300 行）                                                               |

コンポーネントはフックを直接呼ばず、同じディレクトリの `useService` から受け取った値と `handleXxx` を JSX に渡すだけにしている。
TanStack Query の `useQuery`・`useMutation` も `useService` の中で呼ぶ。

`typescript/no-floating-promises` を動かすため、`oxlint-tsgolint` を入れて `typeAware` を有効にしている。
整形は `oxfmt.config.mts` で code-lint の `oxfmtrc.json` を読み込んで広げている。

## 仕様テスト

仕様は `spec.ts` に `@ksugawara61/spec` の `defineSpec` で宣言する。
ケースのキーは `<場面>.<結果>`（例: `submit.error`）で、仕様 ID は `<feature>.<場面>.<結果>` になる。

```ts
export const spec = defineSpec("todo-add", {
  "submit.error": {
    given: "作成に失敗する API に向けて表示し、タイトルを入力しておく",
    when: "追加ボタンを押す",
    yields: ["エラーを表示する", "入力したタイトルが残る"],
  },
});
```

テストは `@ksugawara61/spec/vitest` の `specIt(spec, key, { given, when, yields })` で書く。
各フェーズの `desc` には `spec.ts` の仕様文をそのまま書く。食い違うと typecheck が失敗する。

- `given`：前提を作る。MSW のハンドラーを差し替えて描画し、`userEvent` を返す
- `when`：操作を 1 つだけ、式で書く。待たない。`given` の戻り値を受け取る
- `yields`：検証だけを書く。操作しない。`spec.ts` で配列にしたケースは配列にする

`pnpm test` は、Vitest の `SpecCoverageReporter` が書き出した `coverage/spec-coverage.json` を `check-spec-coverage` で検査する。
`spec.ts` に宣言したのにテストが無いケースや、`spec.ts` に無い仕様 ID を対応付けたテストがあると失敗する。

モックするのは API の境界だけで、MSW で差し替える。
子のフィーチャーで確かめた振る舞いは親で確かめない。
`todo-page` は、追加・完了・削除のあとに一覧が取り直されることだけを確かめる。

## harness のパッケージの取り込み方

`@ksugawara61/code-lint` と `@ksugawara61/spec` はまだ npm に公開されていない。
そのため、harness の `packages/code-lint`・`packages/spec` で `pnpm pack` した tarball を `vendor/` に置き、`file:` で入れている。
npm に公開されたら、`pnpm add -D @ksugawara61/code-lint @ksugawara61/spec` で入れ直し、`vendor/` を消す。
