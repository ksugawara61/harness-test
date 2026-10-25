import { StyleSheet, Text } from "react-native";
import { colors, fontFamily } from "@/ui/theme.ts";

type Props = {
  count: number;
};

export const TodoRemaining = ({ count }: Props) => (
  <Text style={styles.remaining}>残り {count} 件</Text>
);

const styles = StyleSheet.create({
  remaining: { color: colors.muted, fontFamily, lineHeight: 24, marginTop: 16 },
});
