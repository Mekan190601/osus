import { Bell, Search } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h2 className="truncate text-lg font-bold text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 truncate text-sm text-text-muted">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Search className="text-text-muted" size={19} />
        <Bell className="text-text-muted" size={19} />
      </div>
    </div>
  );
}
