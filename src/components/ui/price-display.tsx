interface PriceDisplayProps {
  msrp: number;
}

export function PriceDisplay({ msrp }: PriceDisplayProps) {
  return (
    <div className="border-y border-gray-100 text-center">
      <span className="text-base font-bold text-gray-900">$ {msrp}</span>
    </div>
  );
}
