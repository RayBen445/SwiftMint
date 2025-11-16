interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencySelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currencies: Currency[];
}

export default function CurrencySelector({
  label,
  value,
  onChange,
  currencies,
}: CurrencySelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}
