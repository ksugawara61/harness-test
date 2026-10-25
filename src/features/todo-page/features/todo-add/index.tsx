import { StyleSheet, View } from "react-native";
import { Button } from "@/ui/button/index.tsx";
import { TextField } from "@/ui/text-field/index.tsx";
import { TodoError } from "../../shared/todo-error/index.tsx";
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
    <View aria-label="やることの追加" role="group" style={styles.form}>
      <TextField
        disabled={isPending}
        label="やること"
        onChangeText={handleChangeTitle}
        onSubmit={handleSubmit}
        placeholder="牛乳を買う"
        value={title}
      />
      <Button disabled={!canSubmit} onPress={handleSubmit}>
        追加
      </Button>
      {isError && <TodoError>やることを追加できませんでした</TodoError>}
    </View>
  );
};

const styles = StyleSheet.create({
  form: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
});
