import type { Todo } from "@/api/todo.ts";
import { Alert } from "@/ui/alert/index.tsx";
import { Button } from "@/ui/button/index.tsx";
import { Checkbox } from "@/ui/checkbox/index.tsx";
import { useService } from "./service.ts";

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const { deleteLabel, handleDelete, handleToggle, isError, isPending } =
    useService({ todo });

  return (
    <li className="todo-item">
      <Checkbox
        checked={todo.completed}
        disabled={isPending}
        label={todo.title}
        onChange={handleToggle}
      />
      <Button
        disabled={isPending}
        label={deleteLabel}
        onClick={handleDelete}
        type="button"
        variant="danger"
      >
        削除
      </Button>
      {isError && <Alert>やることを更新できませんでした</Alert>}
    </li>
  );
};
