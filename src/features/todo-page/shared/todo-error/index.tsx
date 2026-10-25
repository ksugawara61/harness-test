import type { ReactNode } from "react";
import { Alert } from "@/ui/alert/index.tsx";
import { Button } from "@/ui/button/index.tsx";
import { useService } from "./service.ts";

type Props = {
  children: ReactNode;
};

export const TodoError = ({ children }: Props) => {
  const { handleDismiss, isDismissed } = useService();

  if (isDismissed) return null;

  return (
    <div className="todo-error">
      <Alert>{children}</Alert>
      <Button label="エラーを閉じる" onClick={handleDismiss} type="button">
        閉じる
      </Button>
    </div>
  );
};
