import { createFileRoute } from "@tanstack/react-router";
import { TodoPage } from "@/features/todo-page/index.tsx";

export const Route = createFileRoute("/")({ component: TodoPage });
