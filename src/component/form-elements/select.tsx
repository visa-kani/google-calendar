type selectProps = {
  label?: string;
  error?: any;
  options?: { value: string; label: string }[];
  className?: string;
  containerClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  name?: string;
};

export const Select = (props: selectProps) => {
  const {
    label,
    error,
    options = [],
    value,
    onChange,
    onBlur,
    className,
    containerClassName,
    name,
  } = props;
  return (
    <div className={`mb-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        name={name}
        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 transition-colors ${
          error ? "border-red-300" : "border-gray-300"
        } ${className}`}
        {...props}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="h-3">
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};
