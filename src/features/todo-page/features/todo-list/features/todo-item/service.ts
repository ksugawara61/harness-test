import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteTodo,
  type Todo,
  todosQueryOptions,
  updateTodo,
} from "@/api/todo.ts";

type Params = {
  todo: Todo;
};

export const useService = ({ todo }: Params) => {
  const queryClient = useQueryClient();
  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: todosQueryOptions.queryKey });
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
    deleteLabel: `「${todo.title}」を削除`,
    handleDelete,
    handleToggle,
    isError: toggle.isError || remove.isError,
    isPending: toggle.isPending || remove.isPending,
  };
};
