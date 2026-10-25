import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, type Todo, updateTodo } from "@/api/todo.ts";
import { invalidateTodos } from "../../../../shared/invalidate-todos.ts";

type Params = {
  todo: Todo;
};

export const useService = ({ todo }: Params) => {
  const queryClient = useQueryClient();
  const handleSuccess = () => invalidateTodos(queryClient);
  const toggle = useMutation({
    mutationFn: updateTodo,
    onSuccess: handleSuccess,
  });
  const remove = useMutation({
    mutationFn: deleteTodo,
    onSuccess: handleSuccess,
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
