import { queryOptions } from "@tanstack/react-query";

export type Todo = {
  completed: boolean;
  id: string;
  title: string;
};

export type CreateTodoInput = Pick<Todo, "title">;

export type UpdateTodoInput = Pick<Todo, "completed" | "id">;

export const TODOS_PATH = "/api/todos";

const todoPath = (id: string) => `${TODOS_PATH}/${id}`;

const send = async (path: string, init?: RequestInit): Promise<Response> => {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `${init?.method ?? "GET"} ${path} failed with ${response.status}`,
    );
  }
  return response;
};

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await send(TODOS_PATH);
  return (await response.json()) as Todo[];
};

export const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
  const response = await send(TODOS_PATH, {
    body: JSON.stringify(input),
    method: "POST",
  });
  return (await response.json()) as Todo;
};

export const updateTodo = async ({
  id,
  ...input
}: UpdateTodoInput): Promise<Todo> => {
  const response = await send(todoPath(id), {
    body: JSON.stringify(input),
    method: "PATCH",
  });
  return (await response.json()) as Todo;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await send(todoPath(id), { method: "DELETE" });
};

export const todosQueryOptions = queryOptions({
  queryFn: fetchTodos,
  queryKey: ["todos"],
});
