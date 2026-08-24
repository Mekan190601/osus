type Props = {
  current: number;
  total: number;
};

export default function StepIndicator({
  current,
  total,
}: Props) {
  return (
    <div className="mb-10 flex items-center justify-center gap-3">
      {Array.from({ length: total }).map((_, index) => {
        const active = index + 1 <= current;

        return (
          <div
            key={index}
            className={`h-3 w-14 rounded-full transition-all ${
              active
                ? "bg-indigo-500"
                : "bg-slate-700"
            }`}
          />
        );
      })}
    </div>
  );
}