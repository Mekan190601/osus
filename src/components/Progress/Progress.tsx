type ProgressProps = {
  value: number;
};

export default function Progress({ value }: ProgressProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}