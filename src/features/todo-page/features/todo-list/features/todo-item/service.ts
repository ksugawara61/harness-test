import { type FragmentOf, readFragment } from "@/graphql/client.ts";
import { useGraphQLMutation } from "@/lib/graphql-client.ts";
import { DeleteTodoMutation } from "./graphqls/delete-todo-mutation.ts";
import { TodoItemFragment } from "./graphqls/todo-item-fragment.ts";
import { UpdateTodoMutation } from "./graphqls/update-todo-mutation.ts";

type Params = {
  maskedTodo: FragmentOf<typeof TodoItemFragment>;
};

export const useService = ({ maskedTodo }: Params) => {
  const todo = readFragment(TodoItemFragment, maskedTodo);
  const toggle = useGraphQLMutation(UpdateTodoMutation, {
    refetchTypes: ["Todo"],
  });
  const remove = useGraphQLMutation(DeleteTodoMutation, {
    refetchTypes: ["Todo"],
  });

  const handleToggle = () => {
    toggle.mutate({ input: { completed: !todo.completed, id: todo.id } });
  };

  const handleDelete = () => {
    remove.mutate({ id: todo.id });
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
