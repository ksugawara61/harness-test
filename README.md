# harness-test

[harness](https://github.com/ksugawara61/harness) の `@ksugawara61/code-lint` の規約と `@ksugawara61/spec` の仕様テストに従って書いた、Expo（web）・Expo Router・TanStack Query・GraphQL の TODO アプリ。
やることの追加・完了の切り替え・削除と、未完了の件数の表示ができる。

バックエンドは持たない。GraphQL の API（`/api/graphql`）は MSW のモックが応答し、`src/graphql/schema.graphql` のスキーマで、メモリ上の TODO を読み書きする。
そのため、リロードするとデータは消える。
対象は web だけで、`app.json` の `platforms` を `["web"]` にしている。

## 使い方

```bash
pnpm install
pnpm dev           # Expo の開発サーバー（web）。EXPO_PUBLIC_API_MOCK=offline で、アプリの中のモックの GraphQL API に向く
pnpm storybook     # Storybook の開発サーバー（http://localhost:6006）
pnpm test          # Vitest の仕様テスト・全 story の描画テストと、spec.ts の網羅の検査
pnpm codegen       # schema.graphql から src/graphql/ の生成物を作り直す
pnpm codegen:check # 生成物がスキーマと食い違っていないかを検査する
pnpm lint          # oxlint（型情報を使う検査を含む）・GraphQL・JSON のキー順・dependency-cruiser の依存の検査
pnpm typecheck     # tsc
pnpm format        # oxfmt
pnpm knip          # 未使用の export・依存の検出
pnpm build         # expo export で dist/ に web の静的サイトを出力する（モックは含めない）
pnpm serve         # dist/ を配信する
pnpm build:storybook # storybook-static/ に Storybook を出力する
```

`pnpm build` はモックを含めないため、出力したサイトは `/api/graphql` を持つサーバーが無いと一覧を読み込めない。
モックごと出力するときは、`EXPO_PUBLIC_API_MOCK=offline pnpm build` とする。

## 構成

```text
.storybook/              # Storybook の設定。preview で QueryClient と MSW を story ごとに用意する
app.json                 # Expo の設定。web.output: "static" で、ページごとに HTML を出力する
codegen.ts               # graphql-codegen の設定（モックのリゾルバの型）
scripts/gen-typedefs.ts  # schema.graphql から SDL の文字列を生成する
src/
  app/                   # ルーティング（Expo Router の file-based routing）。ページを描画するだけ
    +html.tsx            # web の静的レンダリングで使う HTML の外枠（lang・title）
    _layout.tsx          # ルートのレイアウト。QueryClient を用意し、子のルートを <Slot /> で描画する
    index.tsx            # `/`。todo-page を描画する
  graphql/               # クライアントとモックが共有する GraphQL の契約
    schema.graphql       # 唯一の手書きのスキーマ
    client.ts            # gql.tada の graphql() と、API のパス（GRAPHQL_PATH）
    graphql-env.d.ts     # gql.tada の型（生成物）
    type-defs.generated.ts  # SDL の文字列（生成物）
    resolvers.generated.ts  # リゾルバの型（生成物）
  lib/
    api.ts               # apiFetch。API への fetch の唯一の入口。モックのときはアプリの中で応答する
    gql.ts               # gqlFetch。gql.tada のドキュメントを送り、data を返す
  api/todo.ts            # GraphQL の操作（gql.tada）と TanStack Query の queryOptions
  mocks/
    schema.ts            # メモリ上のストアを読み書きするリゾルバと、モックのスキーマ
    handlers.ts          # すべての操作をモックのスキーマで実行する MSW のハンドラー（開発サーバー・テスト・story で共用）
  features/
    todo-page/           # 画面。追加フォームと一覧を並べる
      shared/
        todo-error/      # 閉じられるエラーの表示（共有フィーチャー）。todo-add と todo-item で使う
      features/
        todo-add/        # 追加フォーム
        todo-list/       # 一覧
          components/
            todo-remaining.tsx # 未完了の件数（ロジックの無い部品）
          features/
            todo-item/   # 1 件分の完了切り替えと削除
  ui/                    # 見た目だけを持つ部品（button・text-field・checkbox・alert）。部品ごとに index.tsx と stories.tsx を置く
    theme.ts             # 色。src/index.css の CSS 変数を参照する
  index.css              # 色の CSS 変数（ライト・ダーク）と body の背景
  test-utils/            # 描画ヘルパー・MSW のサーバー・QueryClient
  stories.test.tsx       # すべての stories.tsx の story を描画するテスト
```

ルーティングは `src/app/` に、画面の中身は `src/features/` に置き分ける。
`src/app/` のルートのファイルは、`src/features/` 直下のページを default export で渡すだけにする。
データの取得や状態などのロジックはルートのファイルに置かず、フィーチャーの `service.ts` に置く。

```tsx
// src/app/index.tsx
import { TodoPage } from "@/features/todo-page/index.tsx";

export default TodoPage;
```

画面は React Native の部品（`View`・`Text`・`Pressable`・`TextInput`）で書き、web では react-native-web が描画する。
`role` を付けると、react-native-web は意味のある要素（`button`・`ul`・`li`・`main`・`section` など）で描画する。
そのため、テストは DOM の要素を直接書いていたときと同じく、`getByRole` で引ける。
スタイルは `StyleSheet.create` で書き、色は `src/ui/theme.ts` から CSS 変数（`var(--color-text)` など）で参照する。
CSS 変数は `src/index.css` で `prefers-color-scheme` に合わせて切り替えるため、ダークモードにも追従する。
CSS 変数は web でしか使えないため、ネイティブに広げるときは `theme.ts` を差し替える。

`src/features/` の直下には、ページ相当のフィーチャー（`todo-page`）だけを置く。
ページの部品は、ロジックを持てば親の `features/<name>/` にサブフィーチャーとして、ロジックが無ければ親の `components/<name>.tsx` に置く。
サブフィーチャーの中も同じ構成で、`todo-item` は `todo-list` のサブフィーチャーにしている。
import は親から直下のサブフィーチャーへの向きだけにし、ページ同士・サブフィーチャー同士では import しない。
複数のサブフィーチャーで使う部品は、使う側すべてに一番近い共通の親のフィーチャーの `shared/<name>/` に共有フィーチャーとして置く。
共有フィーチャーの構成はサブフィーチャーと同じ。
フィーチャーから `src/app/` は import しない。

## GraphQL とモック

スキーマは `src/graphql/schema.graphql` だけに手で書き、そこから `pnpm codegen` で次の 3 つを生成する。
生成物はコミットし、手で編集しない。CI の `pnpm codegen:check` が、スキーマとの食い違いを落とす。

| 生成物                               | 作るもの                        | 使う側                               |
| ------------------------------------ | ------------------------------- | ------------------------------------ |
| `src/graphql/graphql-env.d.ts`       | gql.tada の型（introspection）  | `src/graphql/client.ts` の `graphql` |
| `src/graphql/type-defs.generated.ts` | SDL の文字列                    | `src/mocks/schema.ts`                |
| `src/graphql/resolvers.generated.ts` | リゾルバの型（graphql-codegen） | `src/mocks/schema.ts`                |

`graphql-env.d.ts` は gql.tada の CLI（`gql-tada generate output`）が、`tsconfig.json` の `gql.tada/ts-plugin` の設定を読んで書き出す。
gql.tada の CLI と TypeScript のプラグインは TypeScript の API を使い、TypeScript 7 では動かないため、TypeScript は 6 にしている。
`pnpm codegen:check` は、`gql-tada check` でクエリがスキーマに合っているかも検査する。

クエリとミューテーションは `src/api/todo.ts` に `graphql()` で書く。
結果と変数の型はスキーマから付くため、スキーマに無いフィールドを書くと typecheck が落ちる。
送るのは `src/lib/gql.ts` の `gqlFetch` で、`fetch` は `src/lib/api.ts` の `apiFetch` からしか呼ばない。

```ts
// src/api/todo.ts
export const TodosQuery = graphql(`
  query Todos {
    todos {
      completed
      id
      title
    }
  }
`);

export const todosQueryOptions = queryOptions({
  queryFn: async () => {
    const { todos } = await gqlFetch(TodosQuery, {});
    return todos;
  },
  queryKey: ["todos"],
});
```

モックは `src/mocks/` に置く。
`schema.ts` は、`schema.graphql` にリゾルバを付けて、メモリ上のストア（`context.todos`）を読み書きする。
`@graphql-tools/mock` の `addMocksToSchema`（`preserveResolvers: true`）を通すため、スキーマに足したフィールドは、リゾルバを書くまで型に合う値が返る。
`handlers.ts` の `createTodoHandlers` は、すべての操作をこのスキーマで実行する MSW のハンドラーを返す。

どこでモックが応答するかは、場面ごとに次のとおり。

| 場面        | モックの差し込み方                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm dev`  | `EXPO_PUBLIC_API_MOCK=offline` のとき、`apiFetch` が MSW の `getResponse` で `handlers` に応答させる |
| `pnpm test` | `msw/node` の `server` が `fetch` を差し替える                                                       |
| Storybook   | `.storybook/preview.tsx` の `virtual:msw` が `fetch` を差し替える                                    |

`apiFetch` は Service Worker を使わず、`fetch` を呼ぶ手前でハンドラーに応答させる。
MSW とモックは動的 import で読み込むため、`EXPO_PUBLIC_API_MOCK` を付けないビルドには入らない。
`EXPO_PUBLIC_API_URL` を付けると、モックを使わないときの API のオリジンを変えられる（既定は `http://localhost:8081`）。

API のサーバー（Expo の API Route など）はまだ無い。
足すときは `/api/graphql` で `schema.graphql` を実行し、`EXPO_PUBLIC_API_MOCK` を外して `apiFetch` をそのサーバーに向ける。

## import のパス

`tsconfig.json` の `paths` と `vite.config.ts` の `resolve.alias` で、`@/` を `src/` に解決する。
Vitest と Storybook も `vite.config.ts` を読むため、同じエイリアスが効く。

同じ単位の内側は相対パスで、単位を越えるときは `@/` で import する。
単位は、`src/features/` 直下のフィーチャー（サブフィーチャーを含む）・`src/` 直下のディレクトリ（`app`・`api`・`ui` など）・`src/` 直下のファイルの 3 種類。

```ts
// src/features/todo-page/features/todo-list/index.tsx
import { Alert } from "@/ui/alert/index.tsx"; // ui のレイヤーへは @/ で書く
import { TodoItem } from "./features/todo-item/index.tsx"; // 同じフィーチャーの内側は相対パス
```

共有フィーチャーは、一番近い親のフィーチャーの `shared/` から相対パスでだけ import する。
`todo-add` と `todo-item` は、失敗したときに閉じられるエラーを出す `todo-error` を共通で使う。
2 つに一番近い共通の親は `todo-page` のため、`todo-page/shared/todo-error/` に置いている。

```ts
// src/features/todo-page/features/todo-add/index.tsx
import { TodoError } from "../../shared/todo-error/index.tsx";

// src/features/todo-page/features/todo-list/features/todo-item/index.tsx
import { TodoError } from "../../../../shared/todo-error/index.tsx";
```

`todo-list` に `shared/` を足すと、`todo-item` から一番近い `shared/` は `todo-list/shared/` になり、`todo-page/shared/` を import できなくなる。
兄弟の `shared/`（`todo-add` から `todo-list/shared/`）や、features の外からの共有フィーチャーの import もできない。
共有フィーチャーを `@/features/...` で import しても落ちる。
この制約は、oxlint の `use-nearest-shared-import` と dependency-cruiser の両方で検査している（「依存の検査」を参照）。

フィーチャー（サブフィーチャーを含む）のディレクトリには、次のファイルを置く。

| ファイル      | 中身                                                                          |
| ------------- | ----------------------------------------------------------------------------- |
| `index.tsx`   | フィーチャーの入口のコンポーネント。export は 1 つだけ                        |
| `service.ts`  | フックとロジックをまとめた `useService`                                       |
| `spec.ts`     | `defineSpec` で宣言した仕様。ケースごとに given・when・yields を書く          |
| `mocks.ts`    | テストと story で使う API のモック。`Record<string, RequestHandler[]>` にする |
| `test.tsx`    | `spec.ts` の各項目を `specIt` で確かめる仕様テスト                            |
| `stories.tsx` | Storybook の story。`mocks.ts` のケースごとに表示を並べる                     |

## 当てている規約

`.oxlintrc.json` で code-lint の `oxlintrc.json` を `extends` し、規約のルールをパスごとに有効にしている。

| 対象                                              | ルール                                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/app/**`                                      | `no-logic-in-routes`（`useLocalSearchParams`・`useServerDocumentContext` だけ許す）                         |
| `src/features/**/*.tsx`                           | `only-use-service-hooks`・`no-handler-in-component`・`no-inline-handler-logic` など                         |
| `src/features/**/index.tsx`                       | `no-multiple-feature-exports`                                                                               |
| `src/features/**/index.tsx`・`src/ui/*/index.tsx` | `use-stories-file`                                                                                          |
| `src/**/stories.tsx`                              | `no-storybook-title`                                                                                        |
| `src/features/**`                                 | `use-service-file-name`・`use-feature-directory`・`no-restricted-imports`（`@/app`）                        |
| `src/features/**/components/**`                   | `no-logic-in-components`                                                                                    |
| `src/features/**/service.ts`                      | `use-service-handle-only`・`no-raw-setter-return`・`no-router-in-use-service-return`                        |
| `src/features/**/mocks.ts`                        | `use-mocks-record`                                                                                          |
| `src/ui/**/*.tsx`                                 | `no-style-prop-in-ui`・`no-test-id`                                                                         |
| `src/**/test.tsx`                                 | `no-raw-vitest-test`・`no-expect-in-given-when`・`no-waiting-in-when` など                                  |
| `src/**`                                          | `max-lines`（300 行）・`no-cross-feature-import`・`no-relative-cross-boundary`・`use-nearest-shared-import` |

Expo Router のルートは default export が要るため、`src/app/**` では `import/no-default-export` を切っている。
`+html.tsx` は、Expo が差し込む script と CSS を `useServerDocumentContext` から受け取って描画するため、このフックだけはルートのファイルでも許している。
`src/graphql/` の生成物は、oxlint・oxfmt の対象から外している。
`.graphql` は oxlint が読めないため、`pnpm lint:graphql` で code-lint の `code-lint-graphql` に検査させる。

コンポーネントはフックを直接呼ばず、同じディレクトリの `service.ts` の `useService` から受け取った値と `handleXxx` を JSX に渡すだけにしている。
TanStack Query の `useQuery`・`useMutation` も `useService` の中で呼ぶ。

`typescript/no-floating-promises` を動かすため、`oxlint-tsgolint` を入れて `typeAware` を有効にしている。
整形は `oxfmt.config.mts` で code-lint の `oxfmtrc.json` を読み込んで広げている。

## 依存の検査

`pnpm lint:deps`（`pnpm lint` からも呼ぶ）で、dependency-cruiser が `src/` の依存を検査する。
`.dependency-cruiser.mjs` の `forbidden` には、harness の `@ksugawara61/code-lint/dependency-cruiser` の `sharedFeatureRules()` と、循環の検出（`no-circular`）を入れている。

```js
// .dependency-cruiser.mjs
import { sharedFeatureRules } from "@ksugawara61/code-lint/dependency-cruiser";

export default {
  forbidden: [...sharedFeatureRules() /* , no-circular */],
  options: {
    parser: "swc",
    tsConfig: { fileName: "tsconfig.json" } /* , ... */,
  },
};
```

| ルール名              | 報告すること                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `shared-not-nearest`  | 共有フィーチャーを、import するモジュールから見て一番近い親の `shared/` 以外から import する |
| `shared-not-relative` | 共有フィーチャーを `@/` のパスエイリアスで import する                                       |
| `no-circular`         | 依存が循環する                                                                               |

`sharedFeatureRules()` は設定を読むたびに `src/features/` の各フィーチャーの `shared/` の有無を見て、ルールを作り直す。
TypeScript 7 は dependency-cruiser が使う TypeScript の API にまだ対応していないため、`parser: "swc"` で `@swc/core` に解析させている。

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
`mocks.ts` は `{ ... } satisfies Record<string, RequestHandler[]>` にし、値に関数を置かない。
失敗するケースは、`src/mocks/handlers.ts` の `graphqlApi` に `src/api/todo.ts` の操作を渡し、`errors` を返すハンドラーにする。

```ts
// src/features/todo-page/features/todo-add/mocks.ts
export const TodoAddMocks = {
  Error: [
    graphqlApi.mutation(CreateTodoMutation, () =>
      HttpResponse.json({ errors: [{ message: "作成に失敗しました" }] }),
    ),
  ],
  Success: createTodoHandlers(),
} satisfies Record<string, RequestHandler[]>;
```

テストはケース名で引いて `server.use(...TodoListMocks.Success)` と書く。
メモリ上のストアはテストの間で共有されるため、`setup.ts` が `afterEach` で `resetTodoStores()` を呼んで初期データに戻す。
子のフィーチャーで確かめた振る舞いは親で確かめない。
`todo-page` は、追加・完了・削除のあとに一覧が取り直されることだけを確かめる。

## Storybook

フィーチャーと UI 部品の入口（`src/features/**/index.tsx`・`src/ui/*/index.tsx`）には、同じディレクトリに `stories.tsx` を置く。
無ければ `code-lint/use-stories-file` が lint で落とすため、コンポーネントを足すときは story も同時に書く。
`components/` の部品は 1 ディレクトリに複数のファイルを置くため、story を置かず、親のフィーチャーの story で表示する。

```tsx
// src/features/todo-page/features/todo-list/stories.tsx
const meta = {
  component: TodoList,
} satisfies Meta<typeof TodoList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: { msw: { handlers: TodoListMocks.Success } },
};
```

- meta に `title` を書かない。ディレクトリから `features/todo-page/features/todo-list` のような名前が付く
- API は `parameters.msw.handlers` に `mocks.ts` のケースを渡して差し替える。`.storybook/preview.tsx` が story ごとに MSW のハンドラーとメモリ上のストアを入れ替える
- QueryClient は `preview.tsx` のデコレーターが story ごとに作る。retry を切っているため、失敗系の表示もすぐに出る
- 操作しないと出ない表示（送信に失敗した後のエラーなど）は、`play` でその状態まで進める。`play` は表示が出るまで待つだけにし、検証は仕様テストに任せる

`src/stories.test.tsx` は、Storybook の `composeStories` ですべての `stories.tsx` の story を jsdom に描画し、`play` まで実行する。
描画や `play` で例外が出ると `pnpm test` が失敗するため、壊れた story を Storybook を開かずに CI で見つけられる。
ブラウザの MSW（`virtual:msw`）はテストでは `msw/node` の `server` に差し替えている。

Vitest と Storybook は Expo（Metro）ではなく Vite で動かす。
`vite.config.ts` で `react-native` を `react-native-web` に置き換えるため、web のアプリと同じ要素で描画される。
graphql は Vite と Node で解決先が分かれて別のモジュールとして読まれるため、Vitest では `@graphql-tools` も Vite で解決させている（`test.server.deps.inline`）。
Storybook では、Expo がビルド時に埋め込む `process.env.EXPO_PUBLIC_*` を `.storybook/main.ts` の `define` で埋めている。

## harness のパッケージの取り込み方

`@ksugawara61/code-lint` と `@ksugawara61/spec` はまだ npm に公開されていない。
そのため、harness の `packages/code-lint`・`packages/spec` で `pnpm pack` した tarball を `vendor/` に置き、`file:` で入れている。
npm に公開されたら、`pnpm add -D @ksugawara61/code-lint @ksugawara61/spec` で入れ直し、`vendor/` を消す。
