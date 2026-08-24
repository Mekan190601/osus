type Props = {
  children: React.ReactNode;
};

export default function Content({ children }: Props) {
  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
        {children}
      </div>
    </main>
  );
}