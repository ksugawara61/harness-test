import { StyleSheet, View } from "react-native";
import type { FragmentOf } from "@/graphql/client.ts";
import { Button } from "@/ui/button/index.tsx";
import { Checkbox } from "@/ui/checkbox/index.tsx";
import { colors } from "@/ui/theme.ts";
import { TodoError } from "../../../../shared/todo-error/index.tsx";
import type { TodoItemFragment } from "./graphqls/todo-item-fragment.ts";
import { useService } from "./service.ts";

type Props = {
  // 一覧のクエリの 1 件を masked のまま受け取り、service.ts で readFragment する
  maskedTodo: FragmentOf<typeof TodoItemFragment>;
};

export const TodoItem = ({ maskedTodo }: Props) => {
  const {
    completed,
    deleteLabel,
    handleDelete,
    handleToggle,
    isError,
    isPending,
    title,
  } = useService({ maskedTodo });

  return (
    <View role="listitem" style={styles.item}>
      <Checkbox
        checked={completed}
        disabled={isPending}
        label={title}
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
