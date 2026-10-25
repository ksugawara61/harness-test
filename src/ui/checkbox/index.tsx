import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fontFamily } from "../theme.ts";

type Props = {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
};

export const Checkbox = ({
  checked,
  disabled = false,
  label,
  onChange,
}: Props) => (
  <Pressable
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onPress={onChange}
    role="checkbox"
    style={styles.checkbox}
  >
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <Text style={styles.mark}>✓</Text>}
    </View>
    <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 3,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkbox: { alignItems: "center", flexDirection: "row", gap: 8 },
  label: { color: colors.text, fontFamily, fontSize: 16, lineHeight: 24 },
  labelChecked: { color: colors.muted, textDecorationLine: "line-through" },
  mark: { color: colors.onAccent, fontSize: 12, lineHeight: 14 },
});
