import { Alert } from "../../../../ui/alert/index.tsx";
import { TodoRemaining } from "./components/todo-remaining.tsx";
import { TodoItem } from "./features/todo-item/index.tsx";
import { useService } from "./service.ts";

export const TodoList = () => {
  const { isEmpty, isError, isPending, remainingCount, todos } = useService();

  if (isPending) return <p role="status">読み込み中…</p>;
  if (isError) return <Alert>やることを読み込めませんでした</Alert>;
  if (isEmpty) return <p className="todo-list__empty">やることはありません</p>;

  return (
    <section aria-label="やること一覧">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      <TodoRemaining count={remainingCount} />
    </section>
  );
};
