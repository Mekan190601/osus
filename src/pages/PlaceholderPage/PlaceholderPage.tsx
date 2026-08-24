type PlaceholderPageProps = {
  title: string;
  description?: string;
};

export default function PlaceholderPage({
  title,
  description = "Bu bölüm indiki sprintlerde professional görnüşde ösdüriler.",
}: PlaceholderPageProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-8">
      <p className="text-sm font-medium text-primary">
        ÖSÜŞ
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-text-muted">
        {description}
      </p>
    </section>
  );
}