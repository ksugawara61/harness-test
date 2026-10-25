import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, todosQueryKey, updateTodo } from "@/api/todo.ts";
import { type FragmentOf, readFragment } from "@/graphql/client.ts";
import { TodoItemFragment } from "./fragment.ts";

type Params = {
  maskedTodo: FragmentOf<typeof TodoItemFragment>;
};

export const useService = ({ maskedTodo }: Params) => {
  const todo = readFragment(TodoItemFragment, maskedTodo);
  const queryClient = useQueryClient();
  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: todosQueryKey });
  const toggle = useMutation({
    mutationFn: updateTodo,
    onSuccess: invalidateTodos,
  });
  const remove = useMutation({
    mutationFn: deleteTodo,
    onSuccess: invalidateTodos,
  });

  const handleToggle = () => {
    toggle.mutate({ completed: !todo.completed, id: todo.id });
  };

  const handleDelete = () => {
    remove.mutate(todo.id);
  };

  return {
    completed: todo.completed,
    deleteLabel: `「${todo.title}」を削除`,
    handleDelete,
    handleToggle,
    isError: toggle.isError || remove.isError,
    isPending: toggle.isPending || remove.isPending,
    title: todo.title,
  };
};
