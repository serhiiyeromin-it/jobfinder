export function LoadingHint({ label = "Laden..." }) {
  return (
    <div className="rounded-xl border border-graphite-800 p-4 text-graphite-300">
      {label}
    </div>
  );
}
export function ErrorHint({ message = "Es ist ein Fehler aufgetreten." }) {
  return (
    <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-red-300">
      {message}
    </div>
  );
}
export function EmptyHint({ message = "Keine Daten vorhanden." }) {
  return (
    <div className="rounded-xl border border-graphite-800 p-4 text-graphite-400">
      {message}
    </div>
  );
}
