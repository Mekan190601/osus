type Props = {
  value: number;
};

export default function ProgressRing({
  value,
}: Props) {
  return (
    <div className="
      flex
      h-44
      w-44
      items-center
      justify-center
      rounded-full
      border-8
      border-indigo-500
      text-5xl
      font-bold
      text-white
    ">
      {value}%
    </div>
  );
}