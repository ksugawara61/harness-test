import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fontFamily } from "../theme.ts";

type Props = {
  children: string;
  disabled?: boolean;
  label?: string;
  onPress?: () => void;
  variant?: "danger" | "primary";
};

export const Button = ({
  children,
  disabled = false,
  label,
  onPress,
  variant = "primary",
}: Props) => (
  <Pressable
    aria-label={label}
    disabled={disabled}
    onPress={onPress}
    role="button"
    style={[styles.button, styles[variant], disabled && styles.disabled]}
  >
    <Text style={[styles.text, variant === "danger" && styles.small]}>
      {children}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: { borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 },
  danger: {
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: colors.primary },
  small: { fontSize: 14 },
  text: { color: colors.onAccent, fontFamily, fontSize: 16, lineHeight: 24 },
});
