import { useState } from "react";
import { useGraphQLMutation } from "@/lib/graphql-client.ts";
import { CreateTodoMutation } from "./graphqls/create-todo-mutation.ts";

export const useService = () => {
  const [title, setTitle] = useState("");
  const { isError, isPending, mutateAsync } = useGraphQLMutation(
    CreateTodoMutation,
    { refetchTypes: ["Todo"] },
  );
  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle !== "" && !isPending;

  const handleChangeTitle = (text: string) => {
    setTitle(text);
  };

  // 追加ボタンと、入力欄で Enter を押したときに呼ぶ
  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await mutateAsync({ input: { title: trimmedTitle } });
    } catch {
      // 失敗は isError で表示し、入力したタイトルを残す
      return;
    }
    setTitle("");
  };

  return {
    canSubmit,
    handleChangeTitle,
    handleSubmit,
    isError,
    isPending,
    title,
  };
};
