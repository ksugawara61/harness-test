import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { createTodo, todosQueryOptions } from "../../../../api/todo.ts";

export const useService = () => {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const { isError, isPending, mutate } = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      setTitle("");
      await queryClient.invalidateQueries({
        queryKey: todosQueryOptions.queryKey,
      });
    },
  });
  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle !== "" && !isPending;

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
