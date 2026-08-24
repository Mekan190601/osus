type Props = {
  children: React.ReactNode;
};

export default function Card({
  children,
}: Props) {
  return (
    <div className="
rounded-3xl
border
border-slate-800
bg-slate-900/60
p-8
backdrop-blur
shadow-xl
">
      {children}
    </div>
  );
}