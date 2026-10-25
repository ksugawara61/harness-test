import { Alert } from "../../../../ui/alert/index.tsx";
import { Button } from "../../../../ui/button/index.tsx";
import { TextField } from "../../../../ui/text-field/index.tsx";
import { useService } from "./service.ts";

export const TodoAdd = () => {
  const {
    canSubmit,
    handleChangeTitle,
    handleSubmit,
    isError,
    isPending,
    title,
  } = useService();

  return (
    <form
      aria-label="やることの追加"
      className="todo-add"
      onSubmit={handleSubmit}
    >
      <TextField
        disabled={isPending}
        label="やること"
        onChange={handleChangeTitle}
        placeholder="牛乳を買う"
        value={title}
      />
      <Button disabled={!canSubmit} type="submit">
        追加
      </Button>
      {isError && <Alert>やることを追加できませんでした</Alert>}
    </form>
  );
};
