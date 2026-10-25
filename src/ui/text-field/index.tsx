import { StyleSheet, TextInput } from "react-native";
import { colors, fontFamily } from "../theme.ts";

type Props = {
  disabled?: boolean;
  label: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  value: string;
};

export const TextField = ({
  disabled = false,
  label,
  onChangeText,
  onSubmit,
  placeholder,
  value,
}: Props) => (
  <TextInput
    aria-disabled={disabled}
    aria-label={label}
    editable={!disabled}
    onChangeText={onChangeText}
    onSubmitEditing={onSubmit}
    placeholder={placeholder}
    placeholderTextColor={colors.muted}
    style={styles.input}
    value={value}
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    color: colors.text,
    flexGrow: 1,
    fontFamily,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
