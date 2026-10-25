import { StyleSheet, View } from "react-native";
import type { Todo } from "@/api/todo.ts";
import { Button } from "@/ui/button/index.tsx";
import { Checkbox } from "@/ui/checkbox/index.tsx";
import { colors } from "@/ui/theme.ts";
import { TodoError } from "../../../../shared/todo-error/index.tsx";
import { useService } from "./service.ts";

type Props = {
  todo: Todo;
};

export const TodoItem = ({ todo }: Props) => {
  const { deleteLabel, handleDelete, handleToggle, isError, isPending } =
    useService({ todo });

  return (
    <View role="listitem" style={styles.item}>
      <Checkbox
        checked={todo.completed}
        disabled={isPending}
        label={todo.title}
        onChange={handleToggle}
      />
      <Button
        disabled={isPending}
        label={deleteLabel}
        onPress={handleDelete}
        variant="danger"
      >
        削除
      </Button>
      {isError && <TodoError>やることを更新できませんでした</TodoError>}
    </View>
  );
};

// 最後の行の下線は一覧の枠に重ねて隠す
const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: -1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
