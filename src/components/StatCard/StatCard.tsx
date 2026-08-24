import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: Props) {
  return (
    <article className="group min-h-36 rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:border-border-strong hover:bg-surface-elevated">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-muted">
            {title}
          </p>

          <h2 className="mt-3 break-words text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </h2>
        </div>

        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60 text-primary transition-all duration-200 group-hover:border-primary/30 group-hover:bg-primary/10">
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
          {description ? (
            <p className="text-sm leading-5 text-text-muted">
              {description}
            </p>
          ) : (
            <span />
          )}

          {trend && (
            <span
              className={[
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                trend.positive === false
                  ? "bg-danger/10 text-danger"
                  : "bg-primary/10 text-primary",
              ].join(" ")}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </article>
  );
}