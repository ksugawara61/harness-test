import { useState } from "react";
import { useGraphQLMutation } from "@/lib/graphql-client.ts";
import { CreateTodoMutation } from "./graphqls/create-todo-mutation.ts";

export const useService = () => {
  const [title, setTitle] = useState("");
  const { isError, isPending, mutate } = useGraphQLMutation(
    CreateTodoMutation,
    { refetchTypes: ["Todo"] },
  );
  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle !== "" && !isPending;

  const handleChangeTitle = (text: string) => {
    setTitle(text);
  };

  // 追加ボタンと、入力欄で Enter を押したときに呼ぶ
  const handleSubmit = () => {
    if (!canSubmit) return;
    mutate(
      { input: { title: trimmedTitle } },
      {
        onSuccess: () => {
          setTitle("");
        },
      },
    );
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
