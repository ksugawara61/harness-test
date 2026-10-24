import type { ChangeEvent } from "react";

type Props = {
  disabled?: boolean;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
};

export const TextField = ({
  disabled = false,
  label,
  onChange,
  placeholder,
  value,
}: Props) => (
  <label className="text-field">
    <span className="visually-hidden">{label}</span>
    <input
      className="text-field__input"
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  </label>
);
