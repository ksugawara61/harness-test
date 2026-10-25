import type { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { colors, fontFamily } from "../theme.ts";

type Props = {
  children: ReactNode;
};

export const Alert = ({ children }: Props) => (
  <Text role="alert" style={styles.alert}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  alert: { color: colors.danger, fontFamily, lineHeight: 24 },
});
