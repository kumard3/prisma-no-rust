interface SpecRowProps {
  label: string;
  value: string;
}

export function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="grid w-full grid-cols-[1fr,4fr] border-b border-gray-100 py-2 last:border-0">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <span className="text-xs text-gray-900">{value}</span>
    </div>
  );
}
