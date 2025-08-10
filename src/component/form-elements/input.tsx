type inputProps = {
  label?: string;
  error?: any;
  className?: string;
  containerClassName?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  style?: React.CSSProperties
};

export const Input = (props: inputProps) => {
  const {
    label,
    error,
    className,
    containerClassName,
    type,
    onChange,
    value,
    onBlur,
    name,
    style
  } = props;
  return (
    <div className={`mb-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        name={name}
        type={type}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
          error ? "border-red-300" : "border-gray-300"
        } ${className}`}
        style={style}
        {...props}
      />
      <div className="h-3">
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};
