import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
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
    <View style={styles.error}>
      <View style={styles.message}>
        <Alert>{children}</Alert>
      </View>
      <Button label="エラーを閉じる" onPress={handleDismiss}>
        閉じる
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  error: { alignItems: "center", flexDirection: "row", gap: 8, width: "100%" },
  message: { flex: 1 },
});
