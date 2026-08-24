type InputProps = {
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export default function Input({
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <textarea
      rows={5}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
mt-2
w-full
rounded-2xl
border
border-slate-700
bg-slate-900
px-5
py-4
text-white
placeholder:text-slate-500
outline-none
transition-all
focus:border-indigo-500
focus:ring-4
focus:ring-indigo-500/20
"
    />
  );
}