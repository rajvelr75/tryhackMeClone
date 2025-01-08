const Input = ({
  type = "text",
  placeholder = "",
  disabled = false,
  readOnly = false, 
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly} 
      className={`flex h-9 mt-5 w-10/12 rounded-md border bg-yellow-200 px-3 py-1 text-base shadow-sm transition-colors 
        placeholder:text-gray-600 
        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
        disabled:cursor-not-allowed disabled:opacity-50 
        ${className}`}
      {...props}
    />
  );
};

export default Input;
