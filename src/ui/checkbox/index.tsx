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
  <label className={`checkbox${checked ? " checkbox--checked" : ""}`}>
    <input
      checked={checked}
      className="checkbox__input"
      disabled={disabled}
      onChange={onChange}
      type="checkbox"
    />
    <span>{label}</span>
  </label>
);
