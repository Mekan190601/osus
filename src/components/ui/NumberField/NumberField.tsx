type Props = {
  label: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

export default function NumberField({
  label,
  value,
  onChange,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </label>

      <input
        type="number"
        value={value}
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
          focus:border-indigo-500
          focus:ring-4
          focus:ring-indigo-500/20
        "
      />
    </div>
  );
}