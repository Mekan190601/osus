type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-8">
      {children}
    </div>
  );
}