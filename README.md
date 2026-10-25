# harness-test

[harness](https://github.com/ksugawara61/harness) の `@ksugawara61/code-lint` の規約と `@ksugawara61/spec` の仕様テストに従って書いた、Expo（web）・Expo Router・TanStack Query・GraphQL の TODO アプリ。
やることの追加・完了の切り替え・削除と、未完了の件数の表示ができる。

GraphQL の API（`/api/graphql`）は、Expo Router の API Route に載せた Hono と graphql-yoga が受ける。
PoC のため DB は持たず、TODO はサーバーのプロセスのメモリに持つ。サーバーを止めるとデータは消える。
API はサーバーを立てずに MSW のモックでも応答できる（「GraphQL とモック」を参照）。
対象は web だけで、`app.json` の `platforms` を `["web"]` にしている。

## 使い方

```bash
pnpm install
pnpm dev           # Expo の開発サーバー（web）。画面と API Route の両方を動かす
pnpm dev:mock      # EXPO_PUBLIC_API_MOCK=server。API Route のリゾルバの無いフィールドを自動でモックする
pnpm dev:offline   # EXPO_PUBLIC_API_MOCK=offline。API Route に送らず、アプリの中の MSW のモックが応答する
pnpm storybook     # Storybook の開発サーバー（http://localhost:6006）
pnpm test          # Vitest の仕様テスト・全 story の描画テストと、spec.ts の網羅の検査
pnpm codegen       # schema.graphql から src/graphql/・src/server/graphql/ の生成物を作り直す
pnpm codegen:check # 生成物がスキーマと食い違っていないかを検査する
pnpm lint          # oxlint（型情報を使う検査を含む）・GraphQL・JSON のキー順・dependency-cruiser の依存の検査
pnpm typecheck     # tsc
pnpm format        # oxfmt
pnpm knip          # 未使用の export・依存の検出
pnpm build         # expo export で dist/client に事前生成した HTML と JS を、dist/server に API Route を出力する（モックは含めない）
pnpm serve         # dist/ を配信する（画面と API Route）
pnpm build:storybook # storybook-static/ に Storybook を出力する
```

`pnpm build` の出力は API Route を含むため、静的ホスティング（GitHub Pages など）では API が動かない。
EAS Hosting などのサーバーに載せるか、API ごとアプリの中に持たせる `EXPO_PUBLIC_API_MOCK=offline pnpm build` で出力する。

## 構成

```text
.storybook/              # Storybook の設定。preview で QueryClient と MSW を story ごとに用意する
app.json                 # Expo の設定。web.output: "static" と expo-router の apiRoutes: true で、HTML の事前生成と API Route を両立する
codegen.ts               # graphql-codegen の設定（サーバーとモックのリゾルバの型）
scripts/gen-typedefs.mts # schema.graphql から SDL の文字列を生成する
src/
  app/                   # ルーティング（Expo Router の file-based routing）。ページを描画するだけ
    +html.tsx            # web の静的レンダリングで使う HTML の外枠（lang・title）
    _layout.tsx          # ルートのレイアウト。QueryClient を用意し、子のルートを <Slot /> で描画する
    index.tsx            # `/`。todo-page を描画する
    api/
      [...route]+api.ts  # キャッチオールの API Route。/api 以下をすべて Hono に渡す（このファイル以外に +api.ts を作らない）
  server/                # サーバー専用。API Route と src/server の中からだけ値を import する
    app.ts               # Hono のアプリ（basePath("/api")）。/api/graphql を graphql-yoga に、/api/health を返す
    app.test.ts          # Hono のアプリに app.request でリクエストを渡すテスト
    graphql/
      schema.ts          # makeExecutableSchema。EXPO_PUBLIC_API_MOCK=server のときは自動のモックを足す
      resolvers.ts       # リゾルバ。データは repositories から読み書きする
      type-defs.generated.ts  # SDL の文字列（生成物）
      resolvers.generated.ts  # リゾルバの型（生成物）
    repositories/todo.ts # TODO のストア（PoC のためメモリ上）。DB に移すときはここだけを差し替える
  graphql/               # クライアント・サーバー・モックが共有する GraphQL の契約
    schema.graphql       # 唯一の手書きのスキーマ
    client.ts            # gql.tada の graphql() と、API のパス（GRAPHQL_PATH）
    graphql-env.d.ts     # gql.tada の型（生成物）
  lib/
    api.ts               # apiFetch。API への fetch の唯一の入口。モックのときはアプリの中で応答する
    gql.ts               # gqlFetch。gql.tada のドキュメントを送り、data を返す
    graphql-client.ts    # useGraphQLQuery・useGraphQLMutation。TanStack Query を包み、query key と取り直しを受け持つ
  mocks/
    graphql.ts           # 操作からハンドラーを作る createMockQuery・createMockMutation と、失敗・読み込み中の resolver
    schema.ts            # メモリ上のストアを読み書きするリゾルバと、モックのスキーマ
    handlers.ts          # すべての操作をモックのスキーマで実行する MSW のハンドラー（開発サーバー・テスト・story で共用）
  features/
    todo-page/           # 画面。追加フォームと一覧を並べる
      shared/
        todo-error/      # 閉じられるエラーの表示（共有フィーチャー）。todo-add と todo-item で使う
      features/
        todo-add/        # 追加フォーム
          graphqls/
            create-todo-mutation.ts
        todo-list/       # 一覧
          graphqls/
            todos-query.ts # 一覧のクエリ。todo-item の fragment を取り込む
          components/
            todo-remaining.tsx # 未完了の件数（ロジックの無い部品）
          features/
            todo-item/   # 1 件分の完了切り替えと削除
              graphqls/
                todo-item-fragment.ts   # 1 件分の描画に使うフィールド
                update-todo-mutation.ts
                delete-todo-mutation.ts
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

| 生成物                                      | 作るもの                        | 使う側                                                   |
| ------------------------------------------- | ------------------------------- | -------------------------------------------------------- |
| `src/graphql/graphql-env.d.ts`              | gql.tada の型（introspection）  | `src/graphql/client.ts` の `graphql`                     |
| `src/server/graphql/type-defs.generated.ts` | SDL の文字列                    | `src/server/graphql/schema.ts`・`src/mocks/schema.ts`    |
| `src/server/graphql/resolvers.generated.ts` | リゾルバの型（graphql-codegen） | `src/server/graphql/resolvers.ts`・`src/mocks/schema.ts` |

SDL は文字列の TS モジュールにして渡し、サーバーで `.graphql` を実行時に読み込まない（Workers などでは `fs` が使えず、Metro・Vitest にも個別の設定が要るため）。

`graphql-env.d.ts` は gql.tada の CLI（`gql-tada generate output`）が、`tsconfig.json` の `gql.tada/ts-plugin` の設定を読んで書き出す。
gql.tada の CLI と TypeScript のプラグインは TypeScript の API を使い、TypeScript 7 では動かないため、TypeScript は 6 にしている。
`pnpm codegen:check` は、`gql-tada check` でクエリがスキーマに合っているかも検査する。

クエリとミューテーションは `graphql()` で書く。
結果と変数の型はスキーマから付くため、スキーマに無いフィールドを書くと typecheck が落ちる。
フィーチャーは、`src/lib/graphql-client.ts` の `useGraphQLQuery`・`useGraphQLMutation` に操作を渡して送る（「クエリと mutation を送るフック」を参照）。
フックは `src/lib/gql.ts` の `gqlFetch` で送り、`fetch` は `src/lib/api.ts` の `apiFetch` からしか呼ばない。

操作（fragment・query・mutation）は、harness の `graphql.md` に従い、使うフィーチャーの `graphqls/<operation-name>.ts` に 1 操作 1 ファイルで置く。
ファイル名は種類（`-fragment`・`-query`・`-mutation`）で終え、export は操作 1 つだけで、名前はファイル名の PascalCase にする。

| 操作                 | 置き場所                                     | 使う側                              |
| -------------------- | -------------------------------------------- | ----------------------------------- |
| `TodoItemFragment`   | `todo-item/graphqls/todo-item-fragment.ts`   | `todo-item` の `readFragment`       |
| `TodosQuery`         | `todo-list/graphqls/todos-query.ts`          | `todo-list` の `useGraphQLQuery`    |
| `CreateTodoMutation` | `todo-add/graphqls/create-todo-mutation.ts`  | `todo-add` の `useGraphQLMutation`  |
| `UpdateTodoMutation` | `todo-item/graphqls/update-todo-mutation.ts` | `todo-item` の `useGraphQLMutation` |
| `DeleteTodoMutation` | `todo-item/graphqls/delete-todo-mutation.ts` | `todo-item` の `useGraphQLMutation` |

`useGraphQLQuery`・`useGraphQLMutation` は、`graphqls/` ではなく使うフィーチャーの `service.ts` の `useService` で呼ぶ。
ミューテーションの結果は使わずに一覧を取り直すため、`id` だけを返させる。

1 件分の描画に使うフィールドは、`todo-item` の fragment に書く（fragment colocation）。
一覧のクエリには、一覧が自分で使うフィールドと `...TodoItem` だけを書く。
`todo-item` に表示を足すときは、`todo-item-fragment.ts` だけを直せばよい。

```ts
// src/features/todo-page/features/todo-list/features/todo-item/graphqls/todo-item-fragment.ts
export const TodoItemFragment = graphql(`
  fragment TodoItem on Todo {
    completed
    id
    title
  }
`);

// src/features/todo-page/features/todo-list/graphqls/todos-query.ts
export const TodosQuery = graphql(
  `
    query Todos {
      todos {
        completed
        id
        ...TodoItem
      }
    }
  `,
  [TodoItemFragment],
);
```

`todo-list` は結果を masked のまま `<TodoItem maskedTodo={todo} />` に渡す。
`todo-item` は `service.ts` の `useService` の冒頭で `readFragment(TodoItemFragment, maskedTodo)` を呼び、読んだ値を返す。
`readFragment` に同じフィーチャーの `graphqls/` 以外の fragment を渡すと、oxlint の `use-own-fragment` が落とす。
`graphql`・`readFragment`・`maskFragments`・`FragmentOf` は、`src/graphql/client.ts` から import する。

`src/server/app.test.ts` は、フィーチャーの `graphqls/` を import できないため、確かめる操作を文字列で書く。

サーバーは、`src/app/api/[...route]+api.ts` がすべてのメソッドを `src/server/app.ts` の Hono のアプリに渡す。
ルーティングは Hono の側だけで書き、Expo の `+api.ts` や `+middleware.ts` は足さない。
`/api/graphql` は graphql-yoga が `src/server/graphql/schema.ts` で実行し、開発中は GraphiQL も開ける。

```ts
// src/server/app.ts
export const app = new Hono()
  .basePath("/api")
  .on(["GET", "POST"], "/graphql", (c) => yoga.fetch(c.req.raw))
  .get("/health", (c) => c.json({ ok: true }));
```

Expo の API Route まわりで、次の 2 つに合わせている。

- Expo のサーバーは、グローバルの `Response` で作った値しか API Route の戻り値として受け付けない。graphql-yoga が同梱の fetch の実装で `Response` を作らないよう、`createYoga` の `fetchAPI` にグローバルの `Request`・`Response` を渡している
- Expo の開発サーバーは、API Route のモジュールをリクエストごとに評価し直す。モジュールの変数はリクエストをまたいで残らないため、`repositories/todo.ts` はストアを `globalThis` に置いている

`expo export` は API Route を CommonJS の `.js` で出力し、`expo serve` はそれを `require` で読む。
`package.json` に `"type": "module"` があると Node が ES モジュールとして読んで失敗するため、`"type"` は付けない。
ES モジュールとして読ませたい設定とスクリプトは、`vite.config.mts`・`scripts/gen-typedefs.mts` のように拡張子で決める。

`src/server/` はサーバー専用で、ほかの場所から値として import すると oxlint の `no-restricted-imports` が落とす（`import type` は許す）。
例外は API Route（`src/app/api/`）と `src/server/` の中、それと `src/mocks/` からの `type-defs.generated.ts` の import だけ。

モックは `src/mocks/` に置く。
サーバーのリゾルバとは別に、`schema.ts` が `schema.graphql` にモック用のリゾルバを付けて、メモリ上のストア（`context.todos`）を読み書きする。
サーバーのリゾルバは DB や秘密情報に触れうるため、モックからは import しない。
`@graphql-tools/mock` の `addMocksToSchema`（`preserveResolvers: true`）を通すため、スキーマに足したフィールドは、リゾルバを書くまで型に合う値が返る。
`handlers.ts` の `handlers` は、すべての操作をこのスキーマで実行する MSW のハンドラーで、`pnpm dev:offline` だけが使う。
テストと story は、フィーチャーの `mocks.ts` が操作ごとに作る、決まった応答を返すハンドラーを使う（「テスト」を参照）。

どこでモックが応答するかは、場面ごとに次のとおり。

| 場面               | GraphQL の応答                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`         | API Route のリゾルバ                                                                                         |
| `pnpm dev:mock`    | API Route のリゾルバ。リゾルバの無いフィールドは `addMocksToSchema`（`preserveResolvers: true`）が返す       |
| `pnpm dev:offline` | `apiFetch` が MSW の `getResponse` で `src/mocks/handlers.ts` の `handlers` に応答させる。サーバーに送らない |
| `pnpm test`        | `msw/node` の `server` が `fetch` を差し替える。`src/server/app.test.ts` は Hono のアプリを直接呼ぶ          |
| Storybook          | `.storybook/preview.tsx` の `virtual:msw` が `fetch` を差し替える                                            |

`apiFetch` は Service Worker を使わず、`fetch` を呼ぶ手前でハンドラーに応答させる。
MSW とモックは動的 import で読み込むため、`EXPO_PUBLIC_API_MOCK` を付けないビルドには入らない。
`apiFetch` は web ではページと同じオリジンの API Route に送る。`EXPO_PUBLIC_API_URL` を付けると、送り先のオリジンを変えられる。

## クエリと mutation を送るフック

フィーチャーは、TanStack Query の `useQuery`・`useMutation` と `gqlFetch` を直接使わず、`src/lib/graphql-client.ts` のフックに操作を渡す。
curio の `@curio/graphql-client`（SWR）のフックにならい、query key と取り直しをフックの中に閉じ込めている。

| フック               | 包むもの      | 第 2 引数                  |
| -------------------- | ------------- | -------------------------- |
| `useGraphQLQuery`    | `useQuery`    | `{ typenames, variables }` |
| `useGraphQLMutation` | `useMutation` | `{ refetchTypes }`         |

```ts
// src/features/todo-page/features/todo-list/service.ts
const { data, isError, isPending } = useGraphQLQuery(TodosQuery, {
  typenames: ["Todo"],
});

// src/features/todo-page/features/todo-add/service.ts
const { isError, isPending, mutateAsync } = useGraphQLMutation(
  CreateTodoMutation,
  { refetchTypes: ["Todo"] },
);
const handleSubmit = async () => {
  try {
    await mutateAsync({ input: { title: trimmedTitle } });
  } catch {
    return; // 失敗は isError で表示する
  }
  setTitle("");
};
```

- query key は、フックが `["graphql", 操作の名前, 変数]` で作る。フィーチャーは query key を持たない
- mutation が成功すると、`refetchTypes` のどれかの型を返すクエリを取り直す。取り直しが終わるまで `isPending` は `true` のまま
- クエリが返す型は、キャッシュした結果に含まれる `__typename` と、`useGraphQLQuery` に渡した `typenames` を合わせたもの
- 一覧のクエリは、空のとき結果から型を拾えないため、`typenames` に型を書く。`TodosQuery` は `__typename` を選ばないため、`typenames: ["Todo"]` を渡している
- 成功したときだけ行う処理（入力欄を空にするなど）は、`mutateAsync` を `await` したあとに書く。`onSuccess` は使わない。失敗は `isError` で表示するため、`catch` では何もしない

取り直すクエリを型で選ぶため、mutation を送る `todo-add`・`todo-item` は、一覧のクエリも query key も import しない。
フィーチャーから `@tanstack/react-query` と `@/lib/gql.ts` を import すると、oxlint の `no-restricted-imports` が落とす。

## import のパス

`tsconfig.json` の `paths` と `vite.config.mts` の `resolve.alias` で、`@/` を `src/` に解決する。
Vitest と Storybook も `vite.config.mts` を読むため、同じエイリアスが効く。

同じ単位の内側は相対パスで、単位を越えるときは `@/` で import する。
単位は、`src/features/` 直下のフィーチャー（サブフィーチャーを含む）・`src/` 直下のディレクトリ（`app`・`lib`・`ui` など）・`src/` 直下のファイルの 3 種類。

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
| `graphqls/`   | フィーチャーが使う GraphQL の操作。1 操作 1 ファイル（`<operation-name>.ts`） |
| `test.tsx`    | `spec.ts` の各項目を `specIt` で確かめる仕様テスト                            |
| `stories.tsx` | Storybook の story。`mocks.ts` のケースごとに表示を並べる                     |

## 当てている規約

`.oxlintrc.json` で code-lint の `oxlintrc.json` を `extends` し、規約のルールをパスごとに有効にしている。

| 対象                                                  | ルール                                                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/**`                                          | `no-logic-in-routes`（`useLocalSearchParams`・`useServerDocumentContext` だけ許す）                                                                           |
| `src/features/**/*.tsx`                               | `only-use-service-hooks`・`no-handler-in-component`・`no-inline-handler-logic` など                                                                           |
| `src/features/**/index.tsx`                           | `no-multiple-feature-exports`                                                                                                                                 |
| `src/features/**/index.tsx`・`src/ui/*/index.tsx`     | `use-stories-file`                                                                                                                                            |
| `src/**/stories.tsx`                                  | `no-storybook-title`                                                                                                                                          |
| `src/features/**`                                     | `use-service-file-name`・`use-feature-directory`・`use-own-fragment`・`no-restricted-imports`（`@/app`・`@/server`・`@tanstack/react-query`・`@/lib/gql.ts`） |
| `src/features/**/graphqls/*.ts`                       | `use-graphql-operation-file`                                                                                                                                  |
| `src/lib/**` などクライアントのコード・`src/mocks/**` | `no-restricted-imports`（`@/server` は `import type` だけ。`src/mocks/**` は `type-defs.generated.ts` も許す）                                                |
| `src/features/**/components/**`                       | `no-logic-in-components`                                                                                                                                      |
| `src/features/**/service.ts`                          | `use-service-handle-only`・`no-raw-setter-return`・`no-router-in-use-service-return`                                                                          |
| `src/features/**/mocks.ts`                            | `use-mocks-record`                                                                                                                                            |
| `src/ui/**/*.tsx`                                     | `no-style-prop-in-ui`・`no-test-id`                                                                                                                           |
| `src/**/test.tsx`                                     | `no-raw-vitest-test`・`no-expect-in-given-when`・`no-waiting-in-when` など                                                                                    |
| `src/**`                                              | `max-lines`（300 行）・`no-cross-feature-import`・`no-relative-cross-boundary`・`use-nearest-shared-import`                                                   |

Expo Router のルートは default export が要るため、`src/app/**` では `import/no-default-export` を切っている。
`+html.tsx` は、Expo が差し込む script と CSS を `useServerDocumentContext` から受け取って描画するため、このフックだけはルートのファイルでも許している。
`src/graphql/graphql-env.d.ts` と `src/server/graphql/*.generated.ts` は生成物のため、oxlint・oxfmt の対象から外している。
`.graphql` は oxlint が読めないため、`pnpm lint:graphql` で code-lint の `code-lint-graphql` に検査させる。

コンポーネントはフックを直接呼ばず、同じディレクトリの `service.ts` の `useService` から受け取った値と `handleXxx` を JSX に渡すだけにしている。
`useGraphQLQuery`・`useGraphQLMutation` も `useService` の中で呼ぶ。

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
解析は `parser: "swc"` で `@swc/core` に任せ、TypeScript の API に頼らない（TypeScript 7 は dependency-cruiser が使う API にまだ対応していないため、7 に上げても動くようにしておく）。

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
ケースはすべて、`src/mocks/graphql.ts` のヘルパーで、同じフィーチャーの `graphqls/` の操作から作る。
curio の `@curio/testing-library` の `createMockQuery`・`createMockMutation`・`mockLoadingResolver` にならっている。

| ヘルパー              | 作るもの                                                                            |
| --------------------- | ----------------------------------------------------------------------------------- |
| `createMockQuery`     | クエリに応答するハンドラー。resolver が返す `data` は、クエリの結果の型で検査される |
| `createMockMutation`  | mutation に応答するハンドラー                                                       |
| `mockDataResolver`    | `data` を返して、操作を成功させる resolver                                          |
| `mockErrorResolver`   | `errors` を返して、操作を失敗させる resolver                                        |
| `mockLoadingResolver` | 応答を返さず、読み込み中のままにする resolver                                       |

```ts
// src/features/todo-page/features/todo-add/mocks.ts
export const TodoAddMocks = {
  Error: [
    createMockMutation(
      CreateTodoMutation,
      mockErrorResolver("作成に失敗しました"),
    ),
  ],
  Success: [
    createMockMutation(
      CreateTodoMutation,
      mockDataResolver({ createTodo: { id: "todo-1" } }),
    ),
  ],
} satisfies Record<string, RequestHandler[]>;
```

テストはケース名で引いて `server.use(...TodoListMocks.Success)` と書く。

fragment を Props で受け取る `todo-item` は、Props に渡す値も `mocks.ts` に `TodoItemFragmentMocks` で置く。
`maskFragments` で masked にした値を `satisfies Record<string, FragmentOf<typeof TodoItemFragment>>` にし、テストと story では `<TodoItem maskedTodo={TodoItemFragmentMocks.Active} />` と書く。
masked にする前の値も `UnmaskedTodoItemFragmentMocks` で export し、親の一覧のモックでは、それと masked の値をスプレッドで重ねる。

```ts
// src/features/todo-page/features/todo-list/features/todo-item/mocks.ts
export const UnmaskedTodoItemFragmentMocks = {
  /** 未完了の「牛乳を買う」 */
  Active: buildTodo({ id: "todo-1", title: "牛乳を買う" }),
  // ...
} satisfies Record<string, ResultOf<typeof TodoItemFragment>>;

export const TodoItemFragmentMocks = {
  /** 未完了の「牛乳を買う」 */
  Active: maskFragments(
    [TodoItemFragment],
    UnmaskedTodoItemFragmentMocks.Active,
  ),
  // ...
} satisfies Record<string, FragmentOf<typeof TodoItemFragment>>;

// src/features/todo-page/features/todo-list/mocks.ts
const activeTodo = {
  ...UnmaskedTodoItemFragmentMocks.Active,
  ...TodoItemFragmentMocks.Active,
};
```

ハンドラーは状態を持たない。
mutation のあとに一覧が変わるケースは、最初の応答を `{ once: true }` で 1 回だけにし、取り直したあとの応答を後ろに並べる。

```ts
// src/features/todo-page/features/todo-list/mocks.ts
SingleThenDeleted: [
  createMockQuery(TodosQuery, mockDataResolver({ todos: [activeTodo] }), once),
  ...TodoItemMocks.Success,
  createMockQuery(TodosQuery, mockDataResolver({ todos: [] })),
],
```

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
- API は `parameters.msw.handlers` に `mocks.ts` のケースを渡して差し替える。`.storybook/preview.tsx` が story ごとに MSW のハンドラーを入れ替える
- 読み込み中の表示は、`mockLoadingResolver` で応答を止めたケース（`TodoListMocks.Loading`）を渡して残す
- QueryClient は `preview.tsx` のデコレーターが story ごとに作る。retry を切っているため、失敗系の表示もすぐに出る
- 操作しないと出ない表示（送信に失敗した後のエラーなど）は、`play` でその状態まで進める。`play` は表示が出るまで待つだけにし、検証は仕様テストに任せる

`src/stories.test.tsx` は、Storybook の `composeStories` ですべての `stories.tsx` の story を jsdom に描画し、`play` まで実行する。
描画や `play` で例外が出ると `pnpm test` が失敗するため、壊れた story を Storybook を開かずに CI で見つけられる。
ブラウザの MSW（`virtual:msw`）はテストでは `msw/node` の `server` に差し替えている。

Vitest と Storybook は Expo（Metro）ではなく Vite で動かす。
Storybook は `@storybook/react-native-web-vite` を使い、`react-native` を `react-native-web` で描画する。
Vitest は `vite.config.mts` の `resolve.alias` で `react-native` を `react-native-web` に置き換える。
どちらも web のアプリと同じ要素で描画される。
`@storybook/react-native-web-vite` が React の Vite プラグインを足すため、`vite.config.mts` には `@vitejs/plugin-react` を入れない（二重に掛かるのを避ける）。
JSX は Vite が `tsconfig.json` の `jsx`（`react-jsx`）で変換する。
graphql は、Vite（`development` 条件）と Node で別のファイルに解決されると別のモジュールとして読まれ、スキーマを実行できない。
そのため `vite.config.mts` の `resolve.alias` で、Vite が解決する `graphql` を、Node が `@graphql-tools`・graphql-yoga に読ませるのと同じファイルに揃えている。
Storybook では、Expo がビルド時に埋め込む `process.env.EXPO_PUBLIC_*` を `.storybook/main.ts` の `define` で埋めている。

## harness のパッケージの取り込み方

`@ksugawara61/code-lint` と `@ksugawara61/spec` はまだ npm に公開されていない。
そのため、harness の `packages/code-lint`・`packages/spec` で `pnpm pack` した tarball を `vendor/` に置き、`file:` で入れている。
npm に公開されたら、`pnpm add -D @ksugawara61/code-lint @ksugawara61/spec` で入れ直し、`vendor/` を消す。
