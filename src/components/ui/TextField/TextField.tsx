type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function TextField({
  label,
  value,
  placeholder,
  onChange,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="
          w-full
          rounded-2xl
          border
          border-slate-700
          bg-slate-900
          px-5
          py-4
          text-white
          outline-none
          transition-all
          placeholder:text-slate-500
          focus:border-indigo-500
          focus:ring-4
          focus:ring-indigo-500/20
        "
      />
    </div>
  );
}