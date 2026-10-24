# harness-test

[harness](https://github.com/ksugawara61/harness) の `@ksugawara61/code-lint` の規約に従って書いた、React・Vite・TanStack Query の TODO アプリ。
やることの追加・完了の切り替え・削除と、未完了の件数の表示ができる。

バックエンドは持たない。開発サーバーでは MSW がメモリ上の REST API（`/api/todos`）として応答する。
そのため、リロードするとデータは消える。

## 使い方

```bash
pnpm install
pnpm dev           # 開発サーバー（MSW の API に向く）
pnpm test          # Vitest の仕様テスト
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
  test-utils/            # specIt・描画ヘルパー・MSW のサーバー
```

フィーチャーのディレクトリには、次のファイルを置く。

| ファイル         | 中身                                                          |
| ---------------- | ------------------------------------------------------------- |
| `index.tsx`      | フィーチャーの入口のコンポーネント。export は 1 つだけ        |
| `use-service.ts` | フックとロジックをまとめた `useService`                       |
| `spec.ts`        | 仕様の一覧。キーごとに、テストで確かめる振る舞いを 1 文で書く |
| `mocks.ts`       | テストで使う API のモック                                     |
| `test.tsx`       | `spec.ts` の各項目を `specIt` で確かめる仕様テスト            |

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

テストは `specIt(spec, key, { given, when, yields })` で書く（`src/test-utils/spec-it.ts`）。

- `given`：前提を作る。MSW のハンドラーを差し替えて描画し、`userEvent` を返す
- `when`：操作を 1 つだけ、式で書く。待たない
- `yields`：検証だけを書く。操作しない。複数あれば配列にする

モックするのは API の境界だけで、MSW で差し替える。
子のフィーチャーで確かめた振る舞いは親で確かめない。
`todo-page` は、追加・完了・削除のあとに一覧が取り直されることだけを確かめる。

## code-lint の取り込み方

`@ksugawara61/code-lint` はまだ npm に公開されていない。
そのため、harness の `packages/code-lint` で `pnpm pack` した tarball を `vendor/` に置き、`file:` で入れている。
npm に公開されたら、`pnpm add -D @ksugawara61/code-lint` で入れ直し、`vendor/` を消す。
