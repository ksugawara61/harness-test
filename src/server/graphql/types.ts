import type { introspection_types } from "@/graphql/graphql-env.d.ts";

// サーバーとモックのリゾルバの型。gql.tada が schema.graphql から生成した graphql-env.d.ts の introspection から導く。
// introspection はフィールドの引数を持たないため、引数の型だけは FieldArgs に手で書く

type Types = introspection_types;

// src/graphql/client.ts の scalars と揃える
type Scalars = { Boolean: boolean; ID: string; String: string };

type TypeRef = { kind: string; name: unknown; ofType: unknown };

type ObjectName = {
  [Name in keyof Types]: Types[Name] extends { kind: "OBJECT" } ? Name : never;
}[keyof Types];

type FieldsOf<Name extends ObjectName> = Types[Name] extends {
  fields: infer Fields;
}
  ? Fields
  : never;

type NonNullType<Ref> = Ref extends { kind: "LIST"; ofType: infer Item }
  ? Array<TypeOf<Item>>
  : Ref extends { kind: "SCALAR"; name: infer Name extends keyof Scalars }
    ? Scalars[Name]
    : Ref extends { kind: "OBJECT"; name: infer Name extends ObjectName }
      ? ObjectType<Name>
      : Ref extends { kind: "INPUT_OBJECT"; name: infer Name extends InputName }
        ? InputType<Name>
        : never;

type TypeOf<Ref> = Ref extends { kind: "NON_NULL"; ofType: infer Inner }
  ? NonNullType<Inner>
  : NonNullType<Ref> | null;

type ObjectType<Name extends ObjectName> = {
  [Field in keyof FieldsOf<Name>]: FieldsOf<Name>[Field] extends {
    type: infer Ref extends TypeRef;
  }
    ? TypeOf<Ref>
    : never;
};

type InputName = {
  [Name in keyof Types]: Types[Name] extends { kind: "INPUT_OBJECT" }
    ? Name
    : never;
}[keyof Types];

type InputType<Name extends InputName> = Types[Name] extends {
  inputFields: Array<infer Field>;
}
  ? {
      [
        Key in Field extends { name: infer N extends string } ? N : never
      ]: Field extends {
        name: Key;
        type: infer Ref extends TypeRef;
      }
        ? TypeOf<Ref>
        : never;
    }
  : never;

type RootName = "Mutation" | "Query";

// Query・Mutation のすべてのフィールドの引数を書かせる
type CheckFieldArgs<
  Args extends { [Name in RootName]: Record<keyof FieldsOf<Name>, unknown> },
> = Args;

// schema.graphql のフィールドの引数。フィールドを書き漏らすと typecheck が落ちる
type FieldArgs = CheckFieldArgs<{
  Mutation: {
    createTodo: { input: InputType<"CreateTodoInput"> };
    deleteTodo: { id: Scalars["ID"] };
    updateTodo: { input: InputType<"UpdateTodoInput"> };
  };
  Query: {
    todos: Record<string, never>;
  };
}>;

export type Todo = ObjectType<"Todo">;

export type Resolvers<Context = unknown> = {
  [Name in RootName]: {
    [Field in keyof FieldsOf<Name>]: (
      parent: unknown,
      args: FieldArgs[Name][Field & keyof FieldArgs[Name]],
      context: Context,
    ) => ObjectType<Name>[Field] | Promise<ObjectType<Name>[Field]>;
  };
};
