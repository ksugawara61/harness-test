import { StyleSheet, Text, View } from "react-native";
import { Alert } from "@/ui/alert/index.tsx";
import { colors, fontFamily } from "@/ui/theme.ts";
import { TodoRemaining } from "./components/todo-remaining.tsx";
import { TodoItem } from "./features/todo-item/index.tsx";
import { useService } from "./service.ts";

export const TodoList = () => {
  const { isEmpty, isError, isPending, remainingCount, todos } = useService();

  if (isPending) {
    return (
      <Text role="status" style={styles.muted}>
        読み込み中…
      </Text>
    );
  }
  if (isError) return <Alert>やることを読み込めませんでした</Alert>;
  if (isEmpty) return <Text style={styles.muted}>やることはありません</Text>;

  return (
    <View aria-label="やること一覧" role="region">
      <View role="list" style={styles.list}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} maskedTodo={todo} />
        ))}
      </View>
      <TodoRemaining count={remainingCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    overflow: "hidden",
  },
  muted: { color: colors.muted, fontFamily, lineHeight: 24 },
});
