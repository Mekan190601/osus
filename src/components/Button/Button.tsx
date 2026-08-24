type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
};
const styles = {
    primary:
        "bg-indigo-600 hover:bg-indigo-500",

    secondary:
        "bg-slate-800 hover:bg-slate-700",
};
export default function Button({
    children,
    onClick,
    variant = "primary",
}: ButtonProps) {
  return (
   <button
  onClick={onClick}
  className={`
w-full
rounded-2xl
bg-indigo-600
py-4
font-semibold
text-white
transition-all
duration-300
hover:bg-indigo-500
hover:shadow-lg
hover:shadow-indigo-500/20
active:scale-95
${styles[variant]}
`}
>
      {children}
    </button>
  );
}