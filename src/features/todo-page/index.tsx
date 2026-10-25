import { StyleSheet, Text, View } from "react-native";
import { colors, fontFamily } from "@/ui/theme.ts";
import { TodoAdd } from "./features/todo-add/index.tsx";
import { TodoList } from "./features/todo-list/index.tsx";

export const TodoPage = () => (
  <View role="main" style={styles.page}>
    <Text aria-level={1} role="heading" style={styles.heading}>
      やること
    </Text>
    <TodoAdd />
    <TodoList />
  </View>
);

const styles = StyleSheet.create({
  heading: {
    color: colors.text,
    fontFamily,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  page: {
    alignSelf: "center",
    maxWidth: 560,
    paddingHorizontal: 16,
    paddingVertical: 32,
    width: "100%",
  },
});
