import { TodoAdd } from "../todo-add/index.tsx";
import { TodoList } from "../todo-list/index.tsx";

export const TodoPage = () => (
  <main className="todo-page">
    <h1>やること</h1>
    <TodoAdd />
    <TodoList />
  </main>
);
