type PlaceholderEvent = {
  title: string;
  date: string;
  location: string;
};

export function EventCard({ title, date, location }: PlaceholderEvent) {
  return (
    <div className="rounded-lg border border-black/10 bg-surface p-6 text-surface-foreground shadow-sm">
      <p className="text-sm font-medium text-brand">{date}</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-surface-foreground/70">{location}</p>
    </div>
  );
}
