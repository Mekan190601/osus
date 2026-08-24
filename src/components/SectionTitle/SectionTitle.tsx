type Props = {
  children: React.ReactNode;
};

export default function SectionTitle({ children }: Props) {
  return (
    <h2 className="mb-5 text-xl font-bold text-white">
      {children}
    </h2>
  );
}