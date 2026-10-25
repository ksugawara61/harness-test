import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { todosQueryKey } from "@/api/todo.ts";
import type { VariablesOf } from "@/graphql/client.ts";
import { gqlFetch } from "@/lib/gql.ts";
import { CreateTodoMutation } from "./graphqls/create-todo-mutation.ts";

const createTodo = (input: VariablesOf<typeof CreateTodoMutation>["input"]) =>
  gqlFetch(CreateTodoMutation, { input });

export const useService = () => {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const { isError, isPending, mutate } = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      setTitle("");
      await queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle !== "" && !isPending;

  const handleChangeTitle = (text: string) => {
    setTitle(text);
  };

  // 追加ボタンと、入力欄で Enter を押したときに呼ぶ
  const handleSubmit = () => {
    if (!canSubmit) return;
    mutate({ title: trimmedTitle });
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
